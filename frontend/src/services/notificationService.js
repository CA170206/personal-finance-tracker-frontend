import api from './api';

export const notificationService = {
  // Get all notifications & auto-evaluates bill reminders
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Evaluate & generate reminders on-demand
  generateReminders: async () => {
    const response = await api.post('/notifications/generate-reminders');
    return response.data;
  },
};

export default notificationService;

