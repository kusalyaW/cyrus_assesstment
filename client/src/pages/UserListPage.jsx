import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  async function loadUsers() {
    try {
      const data = await api('/users');
      console.log('Fetched users:', data);
      setUsers(data.data || []);
      
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await api(`/users/${id}`, { method: 'DELETE' });
    loadUsers();
  }

  useEffect(() => { loadUsers(); }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                  style={{ background: '#3498db', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px', marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', padding: '5px 10px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
