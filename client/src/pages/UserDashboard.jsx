import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from '../components/StatCards';

export default function UserDashboard() {
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

  useEffect(() => {
    loadTasks();
  }, []);

  
  async function deleteTask(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      loadTasks();
    } catch (err) {
      alert('Failed to delete task');
      console.error(err);
    }
  }

  if (loading) return <p>Loading your tasks...</p>;

  return (
    <div style={{ padding: '20px' }}>
      
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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

      
      <ul style={{ marginTop: 20, listStyle: 'none', padding: 0 }}>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((t) => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <div>
                <strong>{t.title}</strong> – {t.status}
                <br />
                <small>{t.description}</small>
                <br />
                <small>Due: {t.due_date || '—'}</small>
                <br />
                <small>Assignee: {t.assignee_name || '—'}</small>
                <br />
                <small>Creator: {t.creator_name || '—'}</small>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/dashboard/edit/${t.id}`)}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
