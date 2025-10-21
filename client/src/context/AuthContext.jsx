import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken } from '../api/client';

const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  
  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    if (token) {
      api('/auth/me')
        .then((d) => {
          const u = d.user || d;  
          if (u && u.id) setUser(u);
        })
        .catch(() => {
          // Token is invalid, remove it
          setToken(null);
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    const u = data.user || data;
    console.log('Login response:', u);
    if (!u || !u.id) throw new Error('Invalid response from server');
    
    // Store the JWT token
    if (data.token) {
      setToken(data.token);
    }
    
    setUser(u);
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    setToken(null); // Remove token from localStorage
    setUser(null);
  };

  const register = async (name, email, password) => {
    await api('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    // Don't set user - let them login after registration
  };

  return (
    <AuthCtx.Provider value={{ user, ready, login, logout, register }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
