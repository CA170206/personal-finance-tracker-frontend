import api from './api';

export const bankAccountService = {
  // Get all user bank accounts
  getBankAccounts: async () => {
    const response = await api.get('/bank-accounts');
    return response.data;
  },

  // Get single bank account
  getBankAccountById: async (id) => {
    const response = await api.get(`/bank-accounts/${id}`);
    return response.data;
  },

  // Create bank account manually
  createBankAccount: async (accountData) => {
    const response = await api.post('/bank-accounts', accountData);
    return response.data;
  },

  // Update bank account
  updateBankAccount: async (id, accountData) => {
    const response = await api.put(`/bank-accounts/${id}`, accountData);
    return response.data;
  },

  // Delete bank account
  deleteBankAccount: async (id) => {
    const response = await api.delete(`/bank-accounts/${id}`);
    return response.data;
  },

  // Get transactions associated with this bank account
  getBankAccountTransactions: async (id) => {
    const response = await api.get(`/bank-accounts/${id}/transactions`);
    return response.data;
  },
};

export default bankAccountService;

