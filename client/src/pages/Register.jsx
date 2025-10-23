import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FiUserPlus, FiUser, FiMail, FiLock } from 'react-icons/fi';

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
    <Container className="d-flex align-items-center justify-content-center py-4" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px' }} className="shadow-lg">
        <Card.Body className="p-3 p-sm-4">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-success bg-gradient rounded-circle mb-3"
                 style={{ width: '60px', height: '60px' }}>
              <FiUserPlus size={28} />
            </div>
            <h2 className="mb-0">Create Account</h2>
          </div>

          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FiUser size={16} className="me-2" />
                Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FiMail size={16} className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="you@gmail.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <Form.Text className="text-muted">
                Must be a Gmail address
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FiLock size={16} className="me-2" />
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Choose a password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </Form.Group>

            {err && <Alert variant="danger">{err}</Alert>}

            <Button variant="success" type="submit" className="w-100 mb-3">
              Register
            </Button>
          </Form>

          <p className="text-center mb-0">
            Have an account? <Link to="/login" className="text-primary">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
