import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fintrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if token is expired or invalid
      localStorage.removeItem('fintrack_token');
      localStorage.removeItem('fintrack_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const isMockMode = () => {
  const envMock = import.meta.env.VITE_USE_MOCK;
  const storedMock = localStorage.getItem('fintrack_mock_mode');
  if (storedMock !== null) {
    return storedMock === 'true';
  }
  return envMock === 'true' || envMock === undefined;
};

export const setMockMode = (enabled) => {
  localStorage.setItem('fintrack_mock_mode', enabled ? 'true' : 'false');
};

export default api;
