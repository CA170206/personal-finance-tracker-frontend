import api, { isMockMode } from './api';
import { getStoredTransactions, saveStoredTransactions } from './mockData';

export const transactionService = {
  async getTransactions(filters = {}) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      let transactions = getStoredTransactions();

      // Apply type filter
      if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter((t) => t.type === filters.type);
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        transactions = transactions.filter((t) => t.category === filters.category);
      }

      // Apply search filter (title or notes)
      if (filters.search && filters.search.trim() !== '') {
        const query = filters.search.toLowerCase().trim();
        transactions = transactions.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            (t.notes && t.notes.toLowerCase().includes(query))
        );
      }

      // Apply date range
      if (filters.startDate) {
        transactions = transactions.filter((t) => t.date >= filters.startDate);
      }
      if (filters.endDate) {
        transactions = transactions.filter((t) => t.date <= filters.endDate);
      }

      // Sort
      const sortBy = filters.sort || 'newest';
      transactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
      });

      return {
        data: transactions,
        total: transactions.length,
      };
    }

    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  async createTransaction(transactionData) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const transactions = getStoredTransactions();
      const newTransaction = {
        id: 'tx_' + Date.now(),
        ...transactionData,
        amount: Number(transactionData.amount),
        createdAt: new Date().toISOString(),
      };
      const updated = [newTransaction, ...transactions];
      saveStoredTransactions(updated);
      return newTransaction;
    }

    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  async updateTransaction(id, transactionData) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const transactions = getStoredTransactions();
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }
      const updatedItem = {
        ...transactions[index],
        ...transactionData,
        amount: Number(transactionData.amount),
        updatedAt: new Date().toISOString(),
      };
      transactions[index] = updatedItem;
      saveStoredTransactions(transactions);
      return updatedItem;
    }

    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  async deleteTransaction(id) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const transactions = getStoredTransactions();
      const filtered = transactions.filter((t) => t.id !== id);
      saveStoredTransactions(filtered);
      return { success: true, id };
    }

    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export default transactionService;
