import apiClient from './client';

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (email: string, password: string, name: string, role: string) =>
    apiClient.post('/auth/register', { email, password, name, role }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  logout: () =>
    apiClient.post('/auth/logout'),
};
