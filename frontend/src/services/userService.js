import api, { isMockMode } from './api';
import { getStoredUser, saveStoredUser } from './mockData';

export const userService = {
  async getProfile() {
    if (isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return getStoredUser();
    }
    const response = await api.get('/users/profile');
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
};

export default userService;

