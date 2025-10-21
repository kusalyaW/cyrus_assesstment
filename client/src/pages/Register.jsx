import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');

  const submit = async e => {
    e.preventDefault();
    
    // Validate email contains "@gmail"
    if (!form.email.toLowerCase().includes('@gmail')) {
      setErr('Email must be a Gmail address');
      return;
    }
    
    try { 
      await register(form.name, form.email, form.password); 
      nav('/login');
    }
    catch (e) { setErr(e.message); }
  };

  return (
    <div className="center">
      <h1>Create account</h1>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
        {err && <p className="error">{err}</p>}
        <button>Register</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
