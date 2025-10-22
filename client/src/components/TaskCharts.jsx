import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function TaskCharts({ tasks }) {
  // Status distribution data
  const statusData = [
    {
      name: 'Pending',
      value: tasks.filter((t) => t.status === 'PENDING').length,
      color: '#f39c12',
    },
    {
      name: 'In Progress',
      value: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      color: '#3498db',
    },
    {
      name: 'Completed',
      value: tasks.filter((t) => t.status === 'COMPLETED').length,
      color: '#27ae60',
    },
  ];

  // Tasks by assignee
  const assigneeMap = {};
  tasks.forEach((task) => {
    const assignee = task.assignee_name || 'Unassigned';
    assigneeMap[assignee] = (assigneeMap[assignee] || 0) + 1;
  });
  const assigneeData = Object.entries(assigneeMap).map(([name, count]) => ({
    name,
    tasks: count,
  }));

  // Tasks by creator
  const creatorMap = {};
  tasks.forEach((task) => {
    const creator = task.creator_name || 'Unknown';
    creatorMap[creator] = (creatorMap[creator] || 0) + 1;
  });
  const creatorData = Object.entries(creatorMap).map(([name, count]) => ({
    name,
    tasks: count,
  }));

  // Tasks with attachments
  const attachmentData = [
    {
      name: 'With Attachments',
      value: tasks.filter((t) => t.attachment_count > 0).length,
      color: '#9b59b6',
    },
    {
      name: 'Without Attachments',
      value: tasks.filter((t) => !t.attachment_count || t.attachment_count === 0).length,
      color: '#95a5a6',
    },
  ];

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontWeight: 'bold', fontSize: '14px' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>📊 Task Analytics</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {/* Status Distribution Pie Chart */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h4 style={{ marginBottom: '15px', color: '#34495e' }}>Task Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Attachment Distribution Pie Chart */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h4 style={{ marginBottom: '15px', color: '#34495e' }}>Tasks with Attachments</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={attachmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attachmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks by Assignee Bar Chart */}
        {assigneeData.length > 0 && (
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h4 style={{ marginBottom: '15px', color: '#34495e' }}>Tasks by Assignee</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={assigneeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tasks by Creator Bar Chart */}
        {creatorData.length > 0 && (
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h4 style={{ marginBottom: '15px', color: '#34495e' }}>Tasks by Creator</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={creatorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#27ae60" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Status Summary Bar Chart */}
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
        }}
      >
        <h4 style={{ marginBottom: '15px', color: '#34495e' }}>Status Overview</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={statusData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
