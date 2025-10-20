import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'USER' });

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api(`/users/${id}`);
        setForm(data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    }
    loadUser();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    await api(`/users/${id}`, { method: 'PUT', body: form });
    navigate('/admin/users');
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: 400,
        margin: '50px auto',
      }}
    >
      <h2>Edit User</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <label>Role</label>
      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button
        type="submit"
        style={{
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '8px',
        }}
      >
        Save Changes
      </button>
    </form>
  );
}
