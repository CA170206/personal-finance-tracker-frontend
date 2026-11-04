import api, { isMockMode } from './api';
import {
  getStoredTransactions,
  getStoredBudgets,
} from './mockData';

// Local storage keys for mock mode conversation persistence
const MOCK_CONVOS_KEY = 'fintrack_mock_ai_conversations';
const MOCK_MSGS_KEY = 'fintrack_mock_ai_messages';

const getMockConversations = () => {
  try {
    const raw = localStorage.getItem(MOCK_CONVOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveMockConversations = (convs) => {
  localStorage.setItem(MOCK_CONVOS_KEY, JSON.stringify(convs));
};

const getMockMessages = (convId) => {
  try {
    const raw = localStorage.getItem(`${MOCK_MSGS_KEY}_${convId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveMockMessages = (convId, msgs) => {
  localStorage.setItem(`${MOCK_MSGS_KEY}_${convId}`, JSON.stringify(msgs));
};

export const aiService = {
  // Send message to AI assistant
  async sendMessage(conversationId, message) {
    if (isMockMode()) {
      await new Promise((r) => setTimeout(r, 600));
      let currentConvId = conversationId;
      if (!currentConvId) {
        currentConvId = 'mock_conv_' + Date.now();
        const convs = getMockConversations();
        convs.unshift({
          id: currentConvId,
          title: message.slice(0, 40),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        saveMockConversations(convs);
      }

      const txs = getStoredTransactions();
      const budgets = getStoredBudgets();

      const text = message.toLowerCase();
      let content = '';
      const insights = [];
      const toolCalls = [];

      if (text.includes('compare') || text.includes('last month')) {
        const curExp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
        content = `### Monthly Spending Comparison\n\nIn **current month**, your recorded expenses total **₹${curExp.toLocaleString('en-IN')}**.`;
        insights.push({
          type: 'comparison_card',
          title: 'Monthly Cash Flow Comparison',
          data: { currentExpenses: curExp, previousExpenses: Math.round(curExp * 0.85), percentageChange: 17.6, trend: 'increased' },
        });
        toolCalls.push({ tool: 'compareMonthlySpending' });
      } else if (text.includes('food') || text.includes('spend on')) {
        const foodTxs = txs.filter((t) => (t.category || '').toLowerCase() === 'food' && t.type === 'expense');
        const foodTotal = foodTxs.reduce((s, t) => s + Number(t.amount || 0), 0);
        content = `### Spending in Food\n\nYou have spent **₹${foodTotal.toLocaleString('en-IN')}** across ${foodTxs.length} recorded food transactions.`;
        insights.push({
          type: 'category_breakdown_card',
          title: 'Food Spending Breakdown',
          data: { totalExpense: foodTotal, breakdown: [{ category: 'Food', amount: foodTotal, percentage: 100 }] },
        });
        toolCalls.push({ tool: 'getSpendingByCategory' });
      } else if (text.includes('afford')) {
        content = `### Affordability Assessment\n\nBased on your ledger balance and upcoming commitments, you have adequate buffer for this purchase.`;
        insights.push({
          type: 'affordability_meter',
          title: 'Purchase Affordability Analysis',
          score: 85,
          status: 'affordable',
          data: { score: 85, status: 'affordable', availableFunds: 65000, surplusAfterPurchase: 45000, upcomingBillsAmount: 2400 },
        });
        toolCalls.push({ tool: 'analyzeAffordability' });
      } else {
        content = `Hello! Based on your recorded financial records, your net cash flow is healthy and all tracked commitments are up to date. How can I assist your financial planning today?`;
      }

      const assistantMsg = {
        id: 'mock_msg_' + Date.now(),
        conversation_id: currentConvId,
        role: 'assistant',
        content,
        tool_calls: toolCalls,
        insights,
        proposals: [],
        created_at: new Date().toISOString(),
      };

      const existingMsgs = getMockMessages(currentConvId);
      existingMsgs.push({
        id: 'mock_user_' + Date.now(),
        conversation_id: currentConvId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      });
      existingMsgs.push(assistantMsg);
      saveMockMessages(currentConvId, existingMsgs);

      return {
        success: true,
        conversationId: currentConvId,
        message: assistantMsg,
        insights,
        proposals: [],
        suggestedQuestions: ['Compare this month with last month', 'What were my biggest expenses?', 'Show my upcoming bills'],
      };
    }

    const response = await api.post(
      '/ai/chat',
      {
        conversationId,
        message,
      },
      { timeout: 60000 }
    );
    return response.data;
  },

  // Get list of conversation sessions
  async getConversations() {
    if (isMockMode()) {
      return getMockConversations();
    }
    const response = await api.get('/ai/conversations', { timeout: 30000 });
    return response.data.data || [];
  },

  // Create a new conversation session
  async createConversation(title = 'New Financial Chat') {
    if (isMockMode()) {
      const conv = {
        id: 'mock_conv_' + Date.now(),
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const convs = getMockConversations();
      convs.unshift(conv);
      saveMockConversations(convs);
      return conv;
    }
    const response = await api.post('/ai/conversations', { title }, { timeout: 30000 });
    return response.data.data;
  },

  // Get full message history for a conversation
  async getConversationHistory(conversationId) {
    if (isMockMode()) {
      const msgs = getMockMessages(conversationId);
      return {
        conversation: { id: conversationId, title: 'Mock Chat' },
        messages: msgs,
      };
    }
    const response = await api.get(`/ai/conversations/${conversationId}`, { timeout: 30000 });
    return response.data;
  },

  // Delete a conversation session
  async deleteConversation(conversationId) {
    if (isMockMode()) {
      const convs = getMockConversations().filter((c) => c.id !== conversationId);
      saveMockConversations(convs);
      localStorage.removeItem(`${MOCK_MSGS_KEY}_${conversationId}`);
      return { success: true };
    }
    const response = await api.delete(`/ai/conversations/${conversationId}`, { timeout: 30000 });
    return response.data;
  },

  // Get dynamic suggested questions based on real user data
  async getSuggestions() {
    if (isMockMode()) {
      return [
        'Compare this month with last month',
        'How much did I spend on food this month?',
        'What were my biggest expenses?',
        'Can I afford a ₹10,000 purchase?',
        'Which bills are due next week?',
        'Identify my recurring subscriptions.',
      ];
    }
    const response = await api.get('/ai/suggestions', { timeout: 30000 });
    return response.data.data || [];
  },

  // Get user's persistent adaptive memory
  async getMemory() {
    if (isMockMode()) {
      return { memories: [], feedback: [], summaryText: 'Mock Mode Active' };
    }
    const response = await api.get('/ai/memory', { timeout: 30000 });
    return response.data.data;
  },

  // Submit feedback on a recommendation
  async submitFeedback({ messageId, rating, recommendationKey, userComment }) {
    if (isMockMode()) {
      return { success: true };
    }
    const response = await api.post(
      '/ai/feedback',
      {
        messageId,
        rating,
        recommendationKey,
        userComment,
      },
      { timeout: 30000 }
    );
    return response.data;
  },

  // Confirm and execute an action proposal (Security Guardrail)
  async executeProposal(proposalId) {
    if (isMockMode()) {
      return { success: true, message: 'Action proposal confirmed in demo mode.' };
    }
    const response = await api.post(`/ai/proposals/${proposalId}/execute`, {}, { timeout: 45000 });
    return response.data;
  },

  // Reject / Cancel an action proposal
  async rejectProposal(proposalId) {
    if (isMockMode()) {
      return { success: true, message: 'Proposal cancelled.' };
    }
    const response = await api.post(`/ai/proposals/${proposalId}/reject`, {}, { timeout: 30000 });
    return response.data;
  },

  // Run proactive alerts scan
  async scanAlerts() {
    if (isMockMode()) {
      return { success: true, alertsGenerated: 0 };
    }
    const response = await api.post('/ai/alerts/scan', {}, { timeout: 45000 });
    return response.data;
  },
};

export default aiService;
