import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rewear_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('rewear_token');
    setToken(null);
    setUser(null);
  }, []);

  // Restore the session on page load.
  useEffect(() => {
    const restore = async () => {
      const stored = localStorage.getItem('rewear_token');
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.data);
          setToken(stored);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('rewear_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return { ok: true, user: data.data.user };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('rewear_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return { ok: true, user: data.data.user };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) setUser(data.data);
    } catch {
      // keep current state; interceptor handles 401
    }
  };

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};

export default AuthContext;
