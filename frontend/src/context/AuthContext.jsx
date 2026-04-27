import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { normalizeRole } from '../utils/roles';

const AuthContext = createContext(null);

const getStorageItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStorageItem('token');
    if (token) {
      api.get('/users/profile')
        .then((res) => {
          const nextUser = { ...res.data, role: normalizeRole(res.data?.role) };
          setUser(nextUser);
          setStorageItem('user', JSON.stringify(nextUser));
        })
        .catch(() => {
          removeStorageItem('token');
          removeStorageItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/users/login', { email, password });
    setStorageItem('token', res.data.token);
    const nextUser = { ...res.data.user, role: normalizeRole(res.data.user?.role) };
    setStorageItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
    return { ...res.data, user: nextUser };
  };

  const register = async (data) => {
    const res = await api.post('/users/register', { role: 'client', ...data });
    return res.data;
  };

  const logout = () => {
    removeStorageItem('token');
    removeStorageItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
