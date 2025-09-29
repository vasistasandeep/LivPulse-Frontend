import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.code === 'ECONNABORTED' || !error.response) {
      // Handle timeout or no response (server down)
      toast.error('Unable to connect to the server. Please try again later.');
    } else if (error.response.status >= 500) {
      // Handle server errors
      toast.error('Server error. Please try again later.');
    } else if (error.response.status === 502) {
      // Handle bad gateway
      toast.error('The server is currently unavailable. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
