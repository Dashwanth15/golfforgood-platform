import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// ── Request Interceptor: Attach JWT token ─────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('golfforgood_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 globally ─────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('golfforgood_token');
      localStorage.removeItem('golfforgood_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
