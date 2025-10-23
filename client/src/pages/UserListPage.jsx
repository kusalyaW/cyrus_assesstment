import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Container, Table, Button, Badge, Row, Col } from 'react-bootstrap';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  async function loadUsers() {
    try {
      const data = await api('/users');
      console.log('Fetched users:', data);
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await api(`/users/${id}`, { method: 'DELETE' });
    loadUsers();
  }

  useEffect(() => { loadUsers(); }, []);

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0">Users</h2>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>Back</Button>
        </Col>
      </Row>

      <Table hover responsive className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Badge bg={u.role === 'ADMIN' ? 'danger' : 'primary'}>{u.role}</Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => navigate(`/admin/users/edit/${u.id}`)}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {users.length === 0 && (
        <div className="card" style={{ marginTop: '12px' }}>
          <p className="muted">No users found.</p>
        </div>
      )}
    </Container>
  );
}
