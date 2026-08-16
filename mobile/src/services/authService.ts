import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('userToken');
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },
};

export default authService;
