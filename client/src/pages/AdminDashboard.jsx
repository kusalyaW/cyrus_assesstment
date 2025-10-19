import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setTasks(data.data || []));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>All Tasks (Admin)</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> – {t.status} – Created by {t.creator_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
