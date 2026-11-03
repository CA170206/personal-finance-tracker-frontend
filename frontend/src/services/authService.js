import api, { isMockMode } from './api';
import { getStoredUser, saveStoredUser } from './mockData';

export const authService = {
  async login(email, password) {
    if (isMockMode()) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 350));
      const user = getStoredUser();
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('fintrack_token', mockToken);
      localStorage.setItem('fintrack_user', JSON.stringify({ ...user, email }));
      return { token: mockToken, user: { ...user, email } };
    }
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('fintrack_token', response.data.token);
      localStorage.setItem('fintrack_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(name, email, password) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newUser = {
        id: 'usr_' + Date.now(),
        name,
        email,
        currency: 'INR',
        currencySymbol: '₹',
        theme: 'dark',
        role: 'Pro Member',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('fintrack_token', mockToken);
      localStorage.setItem('fintrack_user', JSON.stringify(newUser));
      return { token: mockToken, user: newUser };
    }
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('fintrack_token', response.data.token);
      localStorage.setItem('fintrack_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getCurrentUser() {
    if (isMockMode()) {
      return getStoredUser();
    }
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const current = getStoredUser();
      const updated = { ...current, ...profileData };
      saveStoredUser(updated);
      return updated;
    }
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('fintrack_token');
  },
};

export default authService;
