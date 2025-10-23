import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FiSearch, FiPlus, FiBarChart2, FiEyeOff } from 'react-icons/fi';
import StatCards from '../components/StatCards';
import TaskTable from '../components/TaskTable';
import TaskCharts from '../components/TaskCharts';
import { fetchTasks, deleteTask as deleteTaskApi } from '../api/client';

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
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

  async function handleDeleteTask(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTaskApi(id);
      loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }

  useEffect(() => { loadTasks(); }, [page, debouncedSearch, statusFilter]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Row className="mb-3 mb-md-4 align-items-center">
        <Col xs={12} md>
          <h2 className="mb-2 mb-md-0">My Tasks</h2>
        </Col>
        <Col xs={12} md="auto" className="d-flex flex-wrap gap-2">
          <Button
            variant={showCharts ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setShowCharts(!showCharts)}
            className="flex-grow-1 flex-md-grow-0"
          >
            {showCharts ? <FiEyeOff className="me-1" /> : <FiBarChart2 className="me-1" />}
            {showCharts ? 'Hide' : 'Show'} Analytics
          </Button>
          <Button variant="success" size="sm" onClick={() => navigate('/dashboard/new')} className="flex-grow-1 flex-md-grow-0">
            <FiPlus className="me-1" />
            New Task
          </Button>
        </Col>
      </Row>

      <StatCards tasks={tasks} />

      {showCharts && <TaskCharts tasks={tasks} />}

      <Row className="mb-3 g-2">
        <Col xs={12} md={8}>
          <InputGroup>
            <InputGroup.Text><FiSearch /></InputGroup.Text>
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
        <Col xs={12} md={1}>
          {(searchQuery || statusFilter) && (
            <Button variant="outline-danger" size="sm" className="w-100" onClick={() => { setSearchQuery(''); setStatusFilter(''); setPage(1); }}>
              Clear
            </Button>
          )}
        </Col>
      </Row>

      <TaskTable
        tasks={tasks}
        showActions={true}
        onEdit={(t) => navigate(`/dashboard/edit/${t.id}`)}
        onDelete={handleDeleteTask}
      />

      {meta.total > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Showing {tasks.length} of {meta.total} tasks
          </div>
          <Pagination size="sm" className="mb-0">
            <Pagination.Prev 
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            <Pagination.Item active>{page}</Pagination.Item>
            <Pagination.Item disabled>of {Math.ceil(meta.total / meta.pageSize) || 1}</Pagination.Item>
            <Pagination.Next
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(meta.total / meta.pageSize)}
            />
          </Pagination>
        </div>
      )}
    </>
  );
}
