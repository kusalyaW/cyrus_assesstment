import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from '../components/StatCards';
import TaskCharts from '../components/TaskCharts';
import { fetchTasks, updateTask, api } from '../api/client';
import { Container, Row, Col, Button, Form, InputGroup, Table, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FiSearch, FiUsers, FiBarChart2, FiEyeOff } from 'react-icons/fi';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pageSize: 10 });
  const [showCharts, setShowCharts] = useState(true);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function loadTasks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('q', debouncedSearch);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page);
      params.append('pageSize', 10);
      
      const response = await fetchTasks(`?${params.toString()}`);
      setTasks(response.data || []);
      setMeta(response.meta || { total: 0, pageSize: 10 });
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      const data = await api('/users');
      const all = data.data || [];
      // Exclude admins from assignee options
      setUsers(all.filter(u => (u.role || '').toUpperCase() !== 'ADMIN'));
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }

  async function handleReassign(taskId, newAssigneeId) {
    try {
      await updateTask(taskId, { assignee_id: newAssigneeId || null });
      loadTasks(); // Reload tasks to show updated assignee
    } catch (err) {
      console.error('Failed to reassign task:', err);
      alert('Failed to reassign task');
    }
  }

  useEffect(() => { 
    loadUsers();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [page, debouncedSearch, statusFilter]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="align-items-center mb-3 mb-md-4">
        <Col xs={12} md>
          <h2 className="mb-2 mb-md-0">Admin Dashboard</h2>
        </Col>
        <Col xs={12} md="auto" className="d-flex flex-wrap gap-2">
          <Button
            variant={showCharts ? 'outline-secondary' : 'primary'}
            onClick={() => setShowCharts(!showCharts)}
            size="sm"
            className="flex-grow-1 flex-md-grow-0"
          >
            <FiBarChart2 className="me-1" />
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </Button>
          <Button variant="success" onClick={() => navigate('/admin/users')} size="sm" className="flex-grow-1 flex-md-grow-0">
            <FiUsers className="me-1" />
            Manage Users
          </Button>
        </Col>
      </Row>

      <StatCards tasks={tasks} />

      {showCharts && <TaskCharts tasks={tasks} />}

      <Row className="mb-3 g-2">
        <Col xs={12} md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </Form.Select>
        </Col>
        {(searchQuery || statusFilter) && (
          <Col xs={12} md={1}>
            <Button
              variant="outline-danger"
              className="w-100"
              onClick={() => { setSearchQuery(''); setStatusFilter(''); setPage(1); }}
            >
              Clear
            </Button>
          </Col>
        )}
      </Row>

      <Table hover responsive className="align-middle">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Creator</th>
            <th>Due Date</th>
            <th className="text-center">Attachments</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>
                <Badge bg={
                  task.status === 'COMPLETED' ? 'success' :
                  task.status === 'IN_PROGRESS' ? 'info' : 'warning'
                }>
                  {task.status === 'COMPLETED' ? 'Completed' :
                   task.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending'}
                </Badge>
              </td>
              <td>
                <Form.Select
                  value={task.assignee_id || ''}
                  onChange={(e) => handleReassign(task.id, e.target.value)}
                  size="sm"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>{task.creator_name || '—'}</td>
              <td>
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
              </td>
              <td className="text-center">
                {task.attachment_count > 0 ? (
                  <Badge bg="secondary">📎 {task.attachment_count}</Badge>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <div className="text-muted">
          Showing {tasks.length} of {meta.total} tasks
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
          <Pagination.Item active>{page}</Pagination.Item>
          <Pagination.Next
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(meta.total / meta.pageSize)}
          />
        </Pagination>
      </div>
    </Container>
  );
}
