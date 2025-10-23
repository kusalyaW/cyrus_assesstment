import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, updateTask } from '../api/client';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FiEdit2, FiCalendar } from 'react-icons/fi';

export default function TaskEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    due_date: '',
  });
  const [loading, setLoading] = useState(true);
  

  // Load only this task
  useEffect(() => {
    async function fetchTask() {
      try {
        const task = await api(`/tasks/${id}`);
        setForm({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'PENDING',
          due_date: task.due_date ? task.due_date.slice(0, 10) : '',
        });
      } catch (err) {
        alert('Failed to load task.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateTask(id, form);
      alert('Task updated successfully!');
      navigate('/');
    } catch (err) {
      alert('Failed to update task');
      console.error(err);
    }
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm" style={{ maxWidth: 700, margin: '0 auto' }}>
        <Card.Body className="p-4">
          <h3 className="mb-4">
            <FiEdit2 className="me-2" />
            Edit Task
          </h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
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

            {/* Attachments are now managed from the Task Table. */}

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="outline-secondary" onClick={() => navigate('/')}>
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
