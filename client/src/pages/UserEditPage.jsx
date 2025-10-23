import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FiUser } from 'react-icons/fi';

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'USER' });

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api(`/users/${id}`);
        setForm(data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    }
    loadUser();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    await api(`/users/${id}`, { method: 'PUT', body: form });
    navigate('/admin/users');
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Card.Body className="p-4">
          <h3 className="mb-4 d-flex align-items-center">
            <FiUser className="me-2" /> Edit User
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="outline-secondary" type="button" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
