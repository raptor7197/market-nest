import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints must never trigger the refresh flow: a wrong password is a
// normal 401, not an expired session.
const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/refresh'];
const isAuthRequest = (url = '') => AUTH_PATHS.some((path) => url.includes(path));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Session is truly gone. Clear the token and notify AuthContext so
        // ProtectedRoute can redirect without a hard page reload.
        localStorage.removeItem('accessToken');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:expired'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
