import axios from 'axios';

const envUrl = (import.meta as any).env?.VITE_API_URL;
const API_BASE_URL = envUrl 
  ? `${envUrl.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach admin auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('everest_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
