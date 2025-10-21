import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCards from '../components/StatCards';
import { fetchTasks, updateTask, api } from '../api/client';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
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

  async function loadUsers() {
    try {
      const data = await api('/users');
      setUsers(data.data || []);
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
    loadTasks(); 
    loadUsers();
  }, []);

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

      <StatCards tasks={tasks} />

      {/* Admin Task Table with Reassign Dropdown */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '15px',
          border: '1px solid #ccc',
        }}
      >
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Title</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Status</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Assigned To</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Creator</th>
            <th style={{ padding: 8, border: '1px solid #ccc' }}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{task.title}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{task.status}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>
                <select
                  value={task.assignee_id || ''}
                  onChange={(e) => handleReassign(task.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '3px',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{task.creator_name || '—'}</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
