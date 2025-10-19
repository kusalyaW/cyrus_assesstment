// src/pages/TaskEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, updateTask } from '../api/client';

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

  if (loading) return <p>Loading task...</p>;

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Edit Task</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <label>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />

        <label>Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <label>Due Date</label>
        <input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button
            type="submit"
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              background: '#bdc3c7',
              color: 'black',
              border: 'none',
              borderRadius: 4,
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
