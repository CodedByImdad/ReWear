import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every request when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rewear_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handling: drop the stale token and return to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
    if (status === 401 && !isAuthCall) {
      localStorage.removeItem('rewear_token');
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.request && !error.response) {
    return 'Cannot reach the ReWear server. Please make sure the backend is running on port 5000.';
  }
  return error.message || 'Something went wrong';
};

export const getImageUrl = (image) => {
  if (!image) return null;
  if (/^https?:\/\//.test(image)) return image;
  const base = API_URL.replace(/\/api\/?$/, '');
  return `${base}${image}`;
};

export default api;
