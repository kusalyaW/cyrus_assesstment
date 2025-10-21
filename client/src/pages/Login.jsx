import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link,useNavigate } from 'react-router-dom';

export default function Login() {
  const { login,user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    // Check if OAuth is configured by making a test call
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  useEffect(() => {
    if(user){
        navigate('/',{replace:true});
    }
  },[user,navigate]);

  return (
    <div style={{ maxWidth: 320, margin: '120px auto', textAlign: 'center' }}>
      <h2>Login to Task Manager</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <hr style={{ flex: 1 }} />
        <span style={{ color: '#666' }}>OR</span>
        <hr style={{ flex: 1 }} />
      </div>

      <button
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '10px',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '14px'
        }}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <p style={{ marginTop: '15px' }}>
  Don't have an account? <Link to="/register">Register here</Link>
</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
