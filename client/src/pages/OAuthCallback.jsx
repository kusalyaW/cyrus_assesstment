import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      alert('OAuth authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      // Store the token
      setToken(token);
      
      // Reload to trigger auth context to fetch user data
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="center">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Completing authentication...</h2>
        <p className="muted">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
