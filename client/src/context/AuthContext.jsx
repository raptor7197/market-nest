import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Bumped on every login/signup so a slow init request cannot overwrite a
  // newer session.
  const authVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const versionAtStart = authVersion.current;

    const initAuth = async () => {
      try {
        let token = localStorage.getItem('accessToken');

        // No stored access token, but we may still hold a valid refresh
        // cookie from a previous session.
        if (!token) {
          try {
            const refreshed = await authApi.refresh();
            token = refreshed.data.accessToken;
            localStorage.setItem('accessToken', token);
          } catch {
            token = null;
          }
        }

        if (token) {
          try {
            const { data } = await authApi.getMe();
            if (
              active &&
              authVersion.current === versionAtStart
            ) {
              setUser(data.user);
            }
          } catch {
            localStorage.removeItem('accessToken');
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    initAuth();

    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);

    return () => {
      active = false;
      window.removeEventListener('auth:expired', handleExpired);
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    authVersion.current += 1;
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data;
  };

  const signup = async (email, password, name, role) => {
    const { data } = await authApi.signup({ email, password, name, role });
    authVersion.current += 1;
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authVersion.current += 1;
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
