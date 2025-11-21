import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const urlService = {
  // Create short URL
  createUrl: async (data) => {
    const response = await api.post('/links', data);
    return response.data;
  },

  // Get all URLs
  getUrls: async (search) => {
    const params = search ? { search } : {};
    const response = await api.get('/links', { params });
    return response.data;
  },

  // Get single URL
  getUrl: async (code) => {
    const response = await api.get(`/links/${code}`);
    return response.data;
  },

  // Delete URL
  deleteUrl: async (code) => {
    await api.delete(`/links/${code}`);
  },
};

export const healthService = {
  // Get health status
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;