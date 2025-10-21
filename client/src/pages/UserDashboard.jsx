import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from '../components/StatCards';
import TaskTable from '../components/TaskTable';
import { fetchTasks, deleteTask as deleteTaskApi } from '../api/client';

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadTasks() {
    try {
      const data = await fetchTasks();
      setTasks(data || []);
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

  useEffect(() => { loadTasks(); }, []);

  if (loading) return <p>Loading your tasks...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Tasks</h2>
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

      <StatCards tasks={tasks} />

      <TaskTable
        tasks={tasks}
        showActions={true}
        onEdit={(t) => navigate(`/dashboard/edit/${t.id}`)}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
