import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  BrainCircuit,
  Bell,
  X,
  MessageSquare,
} from 'lucide-react';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AIInsightCard from '../components/ai/AIInsightCard';
import AIActionCard from '../components/ai/AIActionCard';

export const AIAssistant = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  // Memory inspection modal
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [memoryData, setMemoryData] = useState(null);

  // Feedback modal
  const [feedbackDialog, setFeedbackDialog] = useState(null); // { messageId, rating, comment }
  const [feedbackComment, setFeedbackComment] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversation list and initial suggestions on mount
  useEffect(() => {
    loadConversations();
    loadSuggestions();
  }, []);

  const loadConversations = async () => {
    try {
      const list = await aiService.getConversations();
      setConversations(list);
      if (list.length > 0 && !activeConversationId) {
        selectConversation(list[0].id);
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggs = await aiService.getSuggestions();
      setSuggestedQuestions(suggs);
    } catch {
      setSuggestedQuestions([
        'How much did I spend on Food this month?',
        'Compare this month with last month',
        'Can I afford a ₹15,000 purchase?',
        'What are my recurring subscriptions?',
      ]);
    }
  };

  const selectConversation = async (convoId) => {
    setActiveConversationId(convoId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    setFetchingHistory(true);
    try {
      const res = await aiService.getConversationHistory(convoId);
      setMessages(res.messages || []);
    } catch (err) {
      toast.error('Failed to load conversation history');
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleStartNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInputMessage('');
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    if (inputRef.current) inputRef.current.focus();
  };

  const handleDeleteConversation = async (e, convoId) => {
    e.stopPropagation();
    try {
      await aiService.deleteConversation(convoId);
      toast.info('Conversation deleted');
      const updated = conversations.filter((c) => c.id !== convoId);
      setConversations(updated);
      if (activeConversationId === convoId) {
        if (updated.length > 0) {
          selectConversation(updated[0].id);
        } else {
          handleStartNewConversation();
        }
      }
    } catch (err) {
      toast.error('Failed to delete conversation');
    }
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setInputMessage('');

    // Optimistically append user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await aiService.sendMessage(activeConversationId, text);

      if (!activeConversationId && response.conversationId) {
        setActiveConversationId(response.conversationId);
        loadConversations();
      }

      // Append assistant turn
      if (response.message) {
        setMessages((prev) => [
          ...prev,
          {
            ...response.message,
            insights: response.insights || [],
            proposals: response.proposals || [],
            suggestedQuestions: response.suggestedQuestions || [],
          },
        ]);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMsg =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'AI request timed out after 60s. Please try again.'
          : err.message || 'AI request failed. Please check backend connection.');

      toast.error(errorMsg);
      // Append an error notice
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${errorMsg}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenFeedback = (messageId, rating) => {
    setFeedbackDialog({ messageId, rating });
    setFeedbackComment('');
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackDialog) return;
    try {
      await aiService.submitFeedback({
        messageId: feedbackDialog.messageId,
        rating: feedbackDialog.rating,
        userComment: feedbackComment,
      });
      toast.success('Feedback recorded! AI recommendations will adapt to your preferences.');
      setFeedbackDialog(null);
    } catch (err) {
      toast.error('Failed to record feedback');
    }
  };

  const handleScanAlerts = async () => {
    try {
      const res = await aiService.scanAlerts();
      if (res.generatedCount > 0) {
        toast.success(`Generated ${res.generatedCount} proactive financial alert(s)! Check Notifications.`);
      } else {
        toast.info('Financial scan complete: All budgets and cash flow within healthy bounds.');
      }
    } catch (err) {
      toast.error('Failed to run proactive scan');
    }
  };

  const handleOpenMemory = async () => {
    try {
      const mem = await aiService.getMemory();
      setMemoryData(mem);
      setMemoryModalOpen(true);
    } catch {
      toast.error('Failed to load memory');
    }
  };

  // Extract questions that may be embedded in message content as markdown bullets
  const extractQuestionsAndCleanContent = (rawContent, existingSuggestions = []) => {
    if (!rawContent) return { cleanedContent: '', questions: existingSuggestions || [] };

    const lines = rawContent.split('\n');
    const cleanedLines = [];
    const extracted = [];
    let inQuestionSection = false;

    for (const line of lines) {
      const trimmed = line.trim();
      // Check if this line introduces bullet questions
      if (
        trimmed.toLowerCase().includes('you can ask me specific questions such as') ||
        trimmed.toLowerCase().includes('here are some questions you can ask') ||
        trimmed.toLowerCase().includes('click any option below to view detailed breakdown')
      ) {
        inQuestionSection = true;
        continue;
      }

      // Check for bullet lines with questions
      if (inQuestionSection && (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
        const questionMatch = trimmed.replace(/^[-•*]\s*/, '').replace(/^["'*]+|["'*]+$/g, '').trim();
        if (questionMatch.length > 3) {
          extracted.push(questionMatch);
        }
        continue;
      } else if (inQuestionSection && trimmed === '') {
        continue;
      } else {
        inQuestionSection = false;
      }

      // Also check general bullet lines that look like questions in quotes: e.g. • *"Where did most of my money go?"*
      if (trimmed.match(/^[-•*]\s*["'*].*\?["'*]$/)) {
        const questionMatch = trimmed.replace(/^[-•*]\s*/, '').replace(/^["'*]+|["'*]+$/g, '').trim();
        if (questionMatch.length > 3) {
          extracted.push(questionMatch);
          continue;
        }
      }

      cleanedLines.push(line);
    }

    // Combine extracted questions with existingSuggestions, removing duplicates
    const combined = Array.from(new Set([...(existingSuggestions || []), ...extracted])).filter(Boolean);
    return {
      cleanedContent: cleanedLines.join('\n').trim(),
      questions: combined,
    };
  };

  // Simple Markdown renderer for bolding, bullet points, and headers
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-extrabold text-base text-brand-text pt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('- ') || line.startsWith('• ')) {
            const clean = line.replace(/^[-•]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm pl-1">
                <span className="text-brand-text font-black">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(clean) }} />
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p
              key={idx}
              className="text-xs sm:text-sm"
              dangerouslySetInnerHTML={{ __html: formatInline(line) }}
            />
          );
        })}
      </div>
    );
  };

  const formatInline = (text) => {
    // Replace **bold** with <strong>
    let res = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-brand-text">$1</strong>');
    // Replace *italic* with <em>
    res = res.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    // Replace `code` with styled span
    res = res.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-brand-elevated font-mono text-xs">$1</code>');
    return res;
  };

  return (
    <div className="flex h-[calc(100dvh-5rem)] min-h-0 overflow-hidden bg-brand-bg text-brand-text relative">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ===================================================
          1. CONVERSATION SESSIONS SIDEBAR
      =================================================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 sm:w-80 lg:static lg:z-auto
          flex flex-col border-r border-brand-border bg-brand-sidebar transition-all duration-300
          ${
            sidebarOpen
              ? 'translate-x-0 lg:w-72 sm:lg:w-80 shadow-2xl lg:shadow-none'
              : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden pointer-events-none lg:pointer-events-auto'
          }
        `}
      >
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-brand-text">Discussions</h2>
              <p className="text-[10px] text-brand-subtle">FinTrack AI Sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleStartNewConversation}
              className="p-2 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-text transition-colors shadow-sm"
              title="Start new conversation"
              aria-label="Start new conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text transition-colors"
              title="Close discussions"
              aria-label="Close discussions panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-3 border-b border-brand-border/60 flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
              handleScanAlerts();
            }}
            className="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-text flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Scan Alerts</span>
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) setSidebarOpen(false);
              handleOpenMemory();
            }}
            className="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-text flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Memory</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {conversations.length === 0 ? (
            <div className="text-center py-10 px-4 text-xs text-brand-subtle">
              <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p>No previous discussions.</p>
              <p className="text-[11px] mt-1">Start chatting to begin!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-elevated border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{conv.title || 'Discussion'}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 rounded transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ===================================================
          2. MAIN CHAT AREA
      =================================================== */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-brand-bg relative">
        {/* Header Bar */}
        <header className="h-16 border-b border-brand-border bg-brand-card/40 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-text transition-colors flex-shrink-0"
              title="Toggle discussion history"
              aria-label="Toggle discussion history"
            >
              <Layers className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-brand-text tracking-tight flex items-center gap-1.5 truncate">
                  FinTrack AI
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Live Adaptive
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-brand-subtle hidden sm:block truncate">
                Personalized Financial Intelligence • Dynamic Tool Calling • Zero Data Hallucination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-shrink-0">
            <button
              onClick={handleStartNewConversation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 border border-black dark:border-white shadow-sm transition-colors text-xs"
              title="Start new conversation"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.length === 0 && !fetchingHistory && (
            <div className="max-w-2xl mx-auto py-8 sm:py-14 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white flex items-center justify-center mx-auto mb-4 shadow-elevated">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-text tracking-tight mb-2">
                Good day, {user?.name || 'Explorer'}!
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto mb-6 leading-relaxed">
                I am your adaptive financial copilot. I analyze your actual transactions, calculate affordability, and forecast budgets in Indian Rupees (₹).
              </p>

              {/* Suggested Questions */}
              <div className="text-left max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-subtle block mb-2 text-center">
                  Suggested inquiries based on your live financial data:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="p-3 rounded-xl bg-brand-card hover:bg-brand-elevated border border-brand-border text-xs text-left font-medium text-brand-text hover:border-black dark:hover:border-white transition-all shadow-sm flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-subtle group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {fetchingHistory && (
            <div className="flex items-center justify-center py-20 text-brand-muted text-xs gap-2">
              <div className="w-4 h-4 border-2 border-brand-text border-t-transparent rounded-full animate-spin" />
              <span>Loading discussion history...</span>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const { cleanedContent, questions } = isUser
              ? { cleanedContent: msg.content, questions: [] }
              : extractQuestionsAndCleanContent(msg.content, msg.suggestedQuestions);

            return (
              <div
                key={msg.id || index}
                className={`flex gap-2.5 sm:gap-3 max-w-3xl w-full ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm ${
                    isUser
                      ? 'bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white'
                      : 'bg-brand-elevated text-black dark:text-white border border-brand-border'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>

                {/* Message Body */}
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] sm:max-w-[80%] min-w-0`}>
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl shadow-sm min-w-0 break-words w-full overflow-hidden ${
                      isUser
                        ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-sm'
                        : 'bg-brand-card border border-brand-border text-brand-text rounded-tl-sm'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderFormattedContent(cleanedContent)
                    )}

                    {/* Interactive Insight Cards */}
                    {msg.insights && msg.insights.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {msg.insights.map((insight, i) => (
                          <AIInsightCard key={i} insight={insight} />
                        ))}
                      </div>
                    )}

                    {/* Action Proposal Cards */}
                    {msg.proposals && msg.proposals.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {msg.proposals.map((proposal, i) => (
                          <AIActionCard key={i} proposal={proposal} />
                        ))}
                      </div>
                    )}

                    {/* Direct Action Prompt Buttons */}
                    {!isUser && !msg.isError && questions && questions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-brand-border/60">
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-subtle block mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-text" />
                          Direct Actions (Click to get instant answer):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {questions.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => handleSendMessage(q)}
                              className="p-2.5 rounded-xl bg-brand-elevated hover:bg-brand-card border border-brand-border hover:border-black dark:hover:border-white text-xs font-semibold text-brand-text transition-all shadow-sm flex items-center justify-between text-left group min-w-0 w-full"
                              title={`Ask: "${q}"`}
                            >
                              <span className="truncate pr-2">{q}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-brand-subtle group-hover:translate-x-0.5 group-hover:text-brand-text transition-all flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assistant Footer: Feedback */}
                  {!isUser && !msg.isError && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] text-brand-subtle pl-1">
                      <button
                        onClick={() => handleOpenFeedback(msg.id, 'helpful')}
                        className="hover:text-emerald-500 transition-colors flex items-center gap-1 p-1 rounded hover:bg-brand-card"
                        title="Helpful recommendation"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleOpenFeedback(msg.id, 'unhelpful')}
                        className="hover:text-rose-500 transition-colors flex items-center gap-1 p-1 rounded hover:bg-brand-card"
                        title="Unhelpful or inaccurate"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Not helpful</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Loading Bubble */}
          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-brand-border text-black dark:text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-brand-card border border-brand-border shadow-sm flex items-center gap-2 text-xs text-brand-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-brand-text animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-text animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-text animate-bounce" />
                </div>
                <span>Analyzing live financial records & executing deterministic models...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ===================================================
            3. INPUT BAR
        =================================================== */}
        <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-card/70 backdrop-blur-md flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            {/* Quick Chips if conversation active */}
            {messages.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-1 no-scrollbar text-xs">
                <span className="text-[10px] uppercase font-bold text-brand-subtle flex-shrink-0">Quick prompts:</span>
                <button
                  onClick={() => handleSendMessage('Can I afford a ₹10,000 purchase?')}
                  className="px-2.5 py-1 rounded-full bg-brand-elevated hover:bg-brand-border text-brand-muted hover:text-brand-text text-[11px] whitespace-nowrap transition-colors"
                >
                  Affordability check
                </button>
                <button
                  onClick={() => handleSendMessage('Compare this month with last month')}
                  className="px-2.5 py-1 rounded-full bg-brand-elevated hover:bg-brand-border text-brand-muted hover:text-brand-text text-[11px] whitespace-nowrap transition-colors"
                >
                  Monthly comparison
                </button>
                <button
                  onClick={() => handleSendMessage('What are my recurring subscriptions?')}
                  className="px-2.5 py-1 rounded-full bg-brand-elevated hover:bg-brand-border text-brand-muted hover:text-brand-text text-[11px] whitespace-nowrap transition-colors"
                >
                  Subscriptions
                </button>
                <button
                  onClick={() => handleSendMessage('Show my pending bills')}
                  className="px-2.5 py-1 rounded-full bg-brand-elevated hover:bg-brand-border text-brand-muted hover:text-brand-text text-[11px] whitespace-nowrap transition-colors"
                >
                  Upcoming bills
                </button>
              </div>
            )}

            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask FinTrack AI (e.g. 'Can I afford ₹12,000?', 'Food spend this month', 'Create food budget of ₹5,000')..."
                disabled={loading}
                className="w-full pl-3.5 sm:pl-4 pr-11 sm:pr-12 py-2.5 sm:py-3 rounded-xl bg-brand-elevated border border-brand-border focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-xs sm:text-sm text-brand-text placeholder:text-brand-subtle transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="absolute right-2 p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-brand-subtle mt-2 px-1">
              FinTrack AI uses deterministic calculations for balances and budgets. Actions require explicit confirmation.
            </p>
          </div>
        </div>
      </main>

      {/* ===================================================
          4. AI MEMORY MODAL
      =================================================== */}
      {memoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-brand-card border border-brand-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setMemoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-text"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-text">Adaptive Financial Memory</h3>
                <p className="text-xs text-brand-subtle">Persistent traits learned from your transactions & feedback</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto text-xs pr-1">
              {memoryData?.memories && memoryData.memories.length > 0 ? (
                memoryData.memories.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-brand-elevated border border-brand-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-brand-text capitalize">{m.key?.replace(/_/g, ' ')}</span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-card text-brand-subtle">
                        {m.memory_type}
                      </span>
                    </div>
                    <pre className="text-[11px] text-brand-muted whitespace-pre-wrap font-sans">
                      {typeof m.value === 'object' ? JSON.stringify(m.value, null, 2) : m.value}
                    </pre>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-brand-muted">
                  No adaptive memories recorded yet. As you use FinTrack and chat with AI, personalized traits will be stored here.
                </p>
              )}
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setMemoryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          5. FEEDBACK DIALOG
      =================================================== */}
      {feedbackDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <h4 className="font-bold text-sm text-brand-text mb-1">
              {feedbackDialog.rating === 'helpful' ? '👍 Helpful Recommendation' : '👎 Help Us Improve'}
            </h4>
            <p className="text-xs text-brand-muted mb-3">
              Explain your preferences so future AI guidance better reflects your financial goals:
            </p>

            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="e.g. 'I prioritize debt reduction over entertainment', 'I cook at home during weekdays'..."
              className="w-full p-2.5 rounded-xl bg-brand-elevated border border-brand-border text-xs text-brand-text focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white mb-3"
              rows={3}
            />

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setFeedbackDialog(null)}
                className="px-3 py-1.5 rounded-lg text-brand-muted hover:text-brand-text"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-1.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
