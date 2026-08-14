import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default loopback for Android Emulator.
// In physical device debugging, replace this with your host computer's local IP (e.g. 192.168.1.50)
export const API_BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if available
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error fetching token from storage:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await AsyncStorage.removeItem('userToken');
          // Optional: redirect to login if your navigation is linked,
          // or let the Redux auth state listen to auth failures
        } catch (e) {
          console.error('Error clearing expired token:', e);
        }
      }
      return Promise.reject(error.response.data || { message: 'Server Error occurred' });
    } else if (error.request) {
      // Network failure
      return Promise.reject({ message: 'Network error. Please check your internet connection.' });
    } else {
      return Promise.reject({ message: error.message || 'An unknown error occurred' });
    }
  }
);

export default api;
