import api from './api';

export const importService = {
  // Preview CSV transactions & check duplicates
  previewImport: async (payload) => {
    const response = await api.post('/import/preview', payload);
    return response.data;
  },

  // Execute import into Supabase transactions & record sync_logs
  executeImport: async (payload) => {
    const response = await api.post('/import/transactions', payload);
    return response.data;
  },

  // Get import history from sync_logs
  getImportHistory: async () => {
    const response = await api.get('/import/history');
    return response.data;
  },
};

export default importService;

