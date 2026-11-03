import api, { isMockMode } from './api';
import { getStoredTransactions } from './mockData';
import { calculateAnalyticsData } from '../utils/calculations';

export const analyticsService = {
  async getAnalytics(range = '30d') {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const allTransactions = getStoredTransactions();
      return calculateAnalyticsData(allTransactions, range);
    }

    try {
      const response = await api.get('/analytics', { params: { range } });
      return response.data;
    } catch (_err) {
      // Fallback: compute dynamically from user's live transactions
      const txResponse = await api.get('/transactions');
      const txList = txResponse.data?.data || (Array.isArray(txResponse.data) ? txResponse.data : []);
      return calculateAnalyticsData(txList, range);
    }
  },
};

export default analyticsService;
