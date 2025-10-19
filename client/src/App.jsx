import React from 'react';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

export default function App() {
  const { user, ready, logout } = useAuth();

  if (!ready) return <p>Loading session…</p>;
  if (!user) return <p>Unauthorized</p>; // router should normally handle this

  return (
    <div className="app">
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #ccc',
        }}
      >
        <h2 style={{ margin: 0 }}>Task Manager</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>
            Welcome, <strong>{user.name}</strong> ({user.role})
          </span>
          <button
            onClick={logout}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {user.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}
