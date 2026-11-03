import api from './api';

export const billService = {
  // Get all bills with filters
  getBills: async (params = {}) => {
    const response = await api.get('/bills', { params });
    return response.data;
  },

  // Get bills summary (totals, overdue count, category breakdown)
  getBillsSummary: async () => {
    const response = await api.get('/bills/summary');
    return response.data;
  },

  // Get single bill
  getBillById: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  // Create bill manually
  createBill: async (billData) => {
    const response = await api.post('/bills', billData);
    return response.data;
  },

  // Update bill
  updateBill: async (id, billData) => {
    const response = await api.put(`/bills/${id}`, billData);
    return response.data;
  },

  // Mark bill as paid & optionally log transaction
  markBillPaid: async (id, payload = {}) => {
    const response = await api.patch(`/bills/${id}/pay`, payload);
    return response.data;
  },

  // Delete bill
  deleteBill: async (id) => {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },
};

export default billService;

