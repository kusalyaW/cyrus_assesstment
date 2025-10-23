import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiShield, FiCalendar, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function AccountPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      await api('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
        }),
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }

    if (form.newPassword.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await api('/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Please log in to view your account.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="d-flex align-items-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient rounded-circle me-3"
                 style={{ width: '60px', height: '60px' }}>
              <FiUser size={28} />
            </div>
            <div>
              <h2 className="mb-0">Account Settings</h2>
              <p className="text-muted mb-0">Manage your profile and security</p>
            </div>
          </div>

          {message.text && (
            <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
              {message.text}
            </Alert>
          )}

          {/* Profile Information Card */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <FiUser className="me-2" size={20} />
                  Profile Information
                </h5>
                <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'} className="d-flex align-items-center gap-1">
                  <FiShield size={14} />
                  {user.role}
                </Badge>
              </div>

              <Form onSubmit={handleUpdateProfile}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiUser size={14} className="me-1" />
                    Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiMail size={14} className="me-1" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    disabled={!editing}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiCalendar size={14} className="me-1" />
                    Member Since
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                    disabled
                    readOnly
                  />
                </Form.Group>

                <div className="d-flex gap-2 justify-content-end">
                  {editing ? (
                    <>
                      <Button variant="outline-secondary" onClick={() => {
                        setEditing(false);
                        setForm(f => ({
                          ...f,
                          name: user.name || '',
                          email: user.email || '',
                        }));
                      }}>
                        Cancel
                      </Button>
                      <Button variant="success" type="submit" disabled={loading}>
                        <FiSave className="me-1" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Change Password Card */}
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h5 className="mb-3">
                <FiLock className="me-2" size={20} />
                Change Password
              </h5>

              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter current password"
                    value={form.currentPassword}
                    onChange={(e) => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={(e) => setForm(f => ({ ...f, newPassword: e.target.value }))}
                    required
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={loading}>
                    <FiLock className="me-1" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
