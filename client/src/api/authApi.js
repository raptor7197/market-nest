import api from './axios';

export const authApi = {
  signup: async (data) => (await api.post('/auth/signup', data)).data,
  login: async (data) => (await api.post('/auth/login', data)).data,
  logout: async () => (await api.post('/auth/logout')).data,
  refresh: async () =>
    (await api.post('/auth/refresh', {}, { withCredentials: true })).data,
  getMe: async () => (await api.get('/auth/me')).data,
};
