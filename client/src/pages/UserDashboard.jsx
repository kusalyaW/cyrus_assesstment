import React, { useEffect, useState } from 'react';

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setTasks(data.data || []));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>My Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> – {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
