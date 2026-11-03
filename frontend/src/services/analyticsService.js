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

    const response = await api.get('/analytics', { params: { range } });
    return response.data;
  },
};

export default analyticsService;
