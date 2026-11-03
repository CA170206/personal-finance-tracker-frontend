import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { isMockMode, setMockMode } from '../services/api';
import { getStoredUser } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockActive, setMockActive] = useState(isMockMode());

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('fintrack_token');

        if (storedToken) {
          setToken(storedToken);
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser || getStoredUser());
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        localStorage.removeItem('fintrack_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      localStorage.removeItem('fintrack_explicit_logout');
      const data = await authService.login(email, password);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      localStorage.removeItem('fintrack_explicit_logout');
      const data = await authService.register(name, email, password);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.setItem('fintrack_explicit_logout', 'true');
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  const toggleMockMode = (enabled) => {
    setMockMode(enabled);
    setMockActive(enabled);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isMock: mockActive,
    toggleMockMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
