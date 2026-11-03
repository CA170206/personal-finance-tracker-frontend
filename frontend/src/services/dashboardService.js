import api, { isMockMode } from './api';
import { getStoredTransactions } from './mockData';
import {
  calculateFinancialSummary,
  calculateMonthlyOverview,
  calculateExpenseBreakdown,
} from '../utils/calculations';

export const dashboardService = {
  async getSummary(period = 'all') {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const transactions = getStoredTransactions();
      return calculateFinancialSummary(transactions, period);
    }

    const response = await api.get('/dashboard/summary', { params: { period } });
    return response.data;
  },

  async getCharts() {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const transactions = getStoredTransactions();

      const monthlyOverview = calculateMonthlyOverview(transactions, 6);
      const expenseBreakdown = calculateExpenseBreakdown(transactions);
      const totalExpenses = expenseBreakdown.reduce((sum, item) => sum + item.value, 0);

      const spendingTrends = monthlyOverview.map((item) => ({
        month: item.month,
        expenses: item.expenses,
      }));

      return {
        monthlyOverview,
        expenseBreakdown,
        totalExpenses,
        spendingTrends,
        hasData: transactions.length > 0,
      };
    }

    const response = await api.get('/dashboard/charts');
    return response.data;
  },
};

export default dashboardService;
