import React from 'react';

export default function TaskTable({ tasks = [], showActions = false, onEdit, onDelete }) {
  const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
  const token = localStorage.getItem('token');

  const downloadAttachment = (attachmentId) => {
    window.open(
      `${API}/tasks/attachments/${attachmentId}/download?token=${token}`,
      '_blank'
    );
  };

  return (
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
          <th style={{ padding: 8, border: '1px solid #ccc' }}>Assignee</th>
          <th style={{ padding: 8, border: '1px solid #ccc' }}>Creator</th>
          <th style={{ padding: 8, border: '1px solid #ccc' }}>Due Date</th>
          <th style={{ padding: 8, border: '1px solid #ccc' }}>Attachments</th>
          {showActions && <th style={{ padding: 8, border: '1px solid #ccc' }}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td style={{ padding: 8, border: '1px solid #ccc' }}>{t.title}</td>
            <td style={{ padding: 8, border: '1px solid #ccc' }}>{t.status}</td>
            <td style={{ padding: 8, border: '1px solid #ccc' }}>{t.assignee_name || '—'}</td>
            <td style={{ padding: 8, border: '1px solid #ccc' }}>{t.creator_name || '—'}</td>
            <td style={{ padding: 8, border: '1px solid #ccc' }}>
              {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}
            </td>
            <td style={{ padding: 8, border: '1px solid #ccc', textAlign: 'center' }}>
              {t.attachment_count > 0 ? (
                <span
                  style={{
                    background: '#3498db',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                >
                  📎 {t.attachment_count}
                </span>
              ) : (
                '—'
              )}
            </td>
            {showActions && (
              <td style={{ padding: 8, border: '1px solid #ccc' }}>
                <button
                  onClick={() => onEdit && onEdit(t)}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '4px 8px',
                    marginRight: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete && onDelete(t.id)}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
