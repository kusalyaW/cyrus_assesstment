import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) return <p>Loading your tasks...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Tasks</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowCharts(!showCharts)}
            style={{
              background: showCharts ? '#95a5a6' : '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            {showCharts ? '📊 Hide Charts' : '📊 Show Charts'}
          </button>
          <button
            onClick={() => navigate('/dashboard/new')}
            style={{
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            + New Task
          </button>
        </div>
      </div>

      <StatCards tasks={tasks} />

      {/* Charts Section */}
      {showCharts && <TaskCharts tasks={tasks} />}

      {/* Search and Filter Controls */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px',
          marginBottom: '15px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // Reset to first page on filter
          }}
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        {(searchQuery || statusFilter) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <TaskTable
        tasks={tasks}
        showActions={true}
        onEdit={(t) => navigate(`/dashboard/edit/${t.id}`)}
        onDelete={handleDeleteTask}
      />

      {/* Pagination Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        <div style={{ fontSize: '14px', color: '#666' }}>
          Showing {tasks.length} of {meta.total} tasks
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '6px 12px',
              background: page === 1 ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            Previous
          </button>
          <span style={{ padding: '6px 12px', fontSize: '14px' }}>
            Page {page} of {Math.ceil(meta.total / meta.pageSize) || 1}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(meta.total / meta.pageSize)}
            style={{
              padding: '6px 12px',
              background: page >= Math.ceil(meta.total / meta.pageSize) ? '#ccc' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: page >= Math.ceil(meta.total / meta.pageSize) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
