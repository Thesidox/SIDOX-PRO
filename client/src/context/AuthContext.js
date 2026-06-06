import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    if (token && saved) {
      authAPI.verify()
        .then(r => { setUser(r.data.user); })
        .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); })
        .finally(() => setReady(true));
    } else { setReady(true); }
  }, []);
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, ready, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
