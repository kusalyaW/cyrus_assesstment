import React from 'react';
import { Container } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

export default function App() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4">
          <p className="text-muted mb-0">Unauthorized - Please login</p>
        </div>
      </Container>
    );
  }

  return user.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />;
}
