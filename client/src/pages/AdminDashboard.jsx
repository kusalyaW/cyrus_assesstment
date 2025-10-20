import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from '../components/StatCards';
import TaskTable from '../components/TaskTable'; // reuse!

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadTasks() {
    try {
      const res = await fetch('/api/tasks', { credentials: 'include' });
      const data = await res.json();
      setTasks(data.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={() => navigate('/admin/users')}
          style={{
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          Manage Users
        </button>
      </div>

      {/* Overview Cards */}
      <StatCards tasks={tasks} />

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        showActions={false} // admin just monitors
      />
    </div>
  );
}
