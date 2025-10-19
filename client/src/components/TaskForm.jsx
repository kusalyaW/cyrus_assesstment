import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';   
import { createTask, api } from '../api/client';

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
      .then((data) => setUsers(data.data || []))
      .catch(() => setUsers([]));
  }, []);

  async function submit(e) {
    e.preventDefault();

    const payload = form.file
      ? { ...form, files: { attachment: form.file } }
      : form;

    try {
      await createTask(payload);
      setForm({
        title: '',
        description: '',
        status: 'PENDING',
        assignee_id: '',
        due_date: form.due_date || null,
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
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <h3>Create a New Task</h3>

      <input
        type="text"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        required
      />

      <textarea
        placeholder="Description"
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

      <button
        type="submit"
        style={{
          background: '#2ecc71',
          color: 'white',
          padding: '8px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add Task
      </button>
    </form>
  );
}
