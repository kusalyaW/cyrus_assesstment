import React from 'react';

export default function TaskTable({ tasks }) {
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ background: '#eee' }}>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Assignee</th>
          <th>Creator</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id}>
            <td>{t.title}</td>
            <td>{t.status}</td>
            <td>{t.assignee_name || '—'}</td>
            <td>{t.creator_name || '—'}</td>
            <td>{t.due_date || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
