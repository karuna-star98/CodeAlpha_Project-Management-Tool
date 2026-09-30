import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('taskflow_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    localStorage.setItem('taskflow_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('taskflow_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
