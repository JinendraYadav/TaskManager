
import api from './api';
import { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      // Use the correct endpoint
      const response = await api.post('/users/login', credentials);
      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (credentials: RegisterCredentials) => {
    try {
      // Use the correct endpoint
      const response = await api.post('/users/register', credentials);
      console.log('Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      console.log('Current user response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
};

export default authService;
