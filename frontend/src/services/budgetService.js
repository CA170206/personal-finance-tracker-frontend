import api, { isMockMode } from './api';
import {
  getStoredBudgets,
  saveStoredBudgets,
  getStoredOverallBudget,
  saveStoredOverallBudget,
} from './mockData';

export const budgetService = {
  async getBudgets() {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getStoredBudgets();
    }
    const response = await api.get('/budgets');
    return response.data;
  },

  async getOverallBudget() {
    if (isMockMode()) {
      return getStoredOverallBudget();
    }
    const response = await api.get('/budgets/overall');
    return response.data.amount;
  },

  async updateOverallBudget(amount) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      saveStoredOverallBudget(Number(amount));
      return Number(amount);
    }
    const response = await api.put('/budgets/overall', { amount: Number(amount) });
    return response.data;
  },

  async createBudget(budgetData) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const budgets = getStoredBudgets();
      const newBudget = {
        id: 'bg_' + Date.now(),
        ...budgetData,
        allocated: Number(budgetData.allocated),
        period: budgetData.period || 'monthly',
      };
      const updated = [...budgets, newBudget];
      saveStoredBudgets(updated);
      return newBudget;
    }
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  async updateBudget(id, budgetData) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const budgets = getStoredBudgets();
      const index = budgets.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Budget not found');
      const updatedItem = {
        ...budgets[index],
        ...budgetData,
        allocated: Number(budgetData.allocated),
      };
      budgets[index] = updatedItem;
      saveStoredBudgets(budgets);
      return updatedItem;
    }
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  async deleteBudget(id) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const budgets = getStoredBudgets();
      const filtered = budgets.filter((b) => b.id !== id);
      saveStoredBudgets(filtered);
      return { success: true, id };
    }
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default budgetService;
