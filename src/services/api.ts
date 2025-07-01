import axios from 'axios';

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || '';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// 🔁 Automatically prefix all paths with /api if not already
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Auto-prefix "/api" if not already
  if (config.url && !config.url.startsWith('/api')) {
    config.url = '/api' + config.url;
  }

  console.log('API Request:', config.method, config.url);
  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url;
      console.error('API Error:', url, status, error.response.data);
      if (status === 401) {
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
