
import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // Use relative path for production
  return '/api';
};

// Create axios instance with appropriate URL
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  // Add longer timeout to avoid quick failures
  timeout: 30000
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method, config.url);
  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
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

      // 🔐 Auto logout on 401 Unauthorized
      if (status === 401) {
        console.log('Unauthorized access detected. Logging out...');
        localStorage.removeItem('token');
        
        // Only redirect to login if we're not already there
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
