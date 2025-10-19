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
        <p style={{ marginTop: '15px' }}>
  Don’t have an account? <Link to="/register">Register here</Link>
</p>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
