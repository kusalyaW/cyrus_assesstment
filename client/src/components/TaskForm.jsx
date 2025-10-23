import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';   
import { createTask, api } from '../api/client';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FiCalendar, FiUser, FiFileText, FiPaperclip } from 'react-icons/fi';

export default function TaskForm({ onCreated }) {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    assignee_id: '',
    due_date: '',
    file: null,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api('/users')
      .then((data) => {
        const all = data.data || [];
        // Show only non-admins in assignee dropdown
        setUsers(all.filter(u => (u.role || '').toUpperCase() !== 'ADMIN'));
      })
      .catch(() => setUsers([]));
  }, []);

  async function submit(e) {
    e.preventDefault();

    try {
      await createTask(form);
      setForm({
        title: '',
        description: '',
        status: 'PENDING',
        assignee_id: '',
        due_date: '',
        file: null,
      });

      if (onCreated) onCreated();
      else navigate('/');  
    } catch (err) {
      console.error('Task creation failed:', err.message);
      alert('Failed to create task. Please try again.');
    }
  }

  return (
    <Card className="shadow-sm" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Card.Body className="p-4">
        <h3 className="mb-4">
          <FiFileText className="me-2" />
          Create a New Task
        </h3>

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Task description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <FiCalendar size={14} className="me-1" />
                  Due Date
                </Form.Label>
                <Form.Control
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FiUser size={14} className="me-1" />
              Assign to
            </Form.Label>
            <Form.Select
              value={form.assignee_id}
              onChange={(e) => setForm((f) => ({ ...f, assignee_id: e.target.value }))}
            >
              <option value="">Me (default)</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <FiPaperclip size={14} className="me-1" />
              Attachment (Optional)
            </Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files[0] }))}
            />
            {form.file && (
              <Form.Text className="text-muted d-block mt-1">
                Selected: {form.file.name}
              </Form.Text>
            )}
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="outline-secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Add Task
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
