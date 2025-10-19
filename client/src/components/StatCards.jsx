import React from 'react';

export default function StatCards({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  const card = (label, value, color) => (
    <div style={{
      flex: 1,
      padding: 15,
      background: color,
      color: 'white',
      borderRadius: 8,
      textAlign: 'center'
    }}>
      <h3>{label}</h3>
      <h1>{value}</h1>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
      {card('Total', total, '#34495e')}
      {card('Pending', pending, '#f39c12')}
      {card('In Progress', inProgress, '#3498db')}
      {card('Completed', completed, '#27ae60')}
    </div>
  );
}
