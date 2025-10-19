import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  
  useEffect(() => {
    api('/auth/me')
      .then((d) => {
        const u = d.user || d;  
        if (u && u.id) setUser(u);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    const u = data.user || data;
    console.log('Login response:', u);
    if (!u || !u.id) throw new Error('Invalid response from server');
    setUser(u);
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const register = async (name, email, password) => {
    const data = await api('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    const u = data.user || data;
    setUser(u);
  };

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
