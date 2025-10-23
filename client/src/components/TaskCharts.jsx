import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FiPieChart, FiBarChart2 } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TaskCharts({ tasks }) {
  const statusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'PENDING').length, color: '#f59e0b' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#0ea5e9' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED').length, color: '#22c55e' },
  ].filter(d => d.value > 0);

  const withAttachments = tasks.filter(t => t.attachment_count > 0).length;
  const withoutAttachments = tasks.length - withAttachments;
  const attachmentData = [
    { name: 'With Attachments', value: withAttachments, color: '#8b5cf6' },
    { name: 'No Attachments', value: withoutAttachments, color: '#6b7280' },
  ].filter(d => d.value > 0);

  const byAssignee = {};
  tasks.forEach(t => {
    const key = t.assignee_name || 'Unassigned';
    byAssignee[key] = (byAssignee[key] || 0) + 1;
  });
  const assigneeData = Object.entries(byAssignee).map(([name, count]) => ({ name, count }));

  const byCreator = {};
  tasks.forEach(t => {
    const key = t.creator_name || 'Unknown';
    byCreator[key] = (byCreator[key] || 0) + 1;
  });
  const creatorData = Object.entries(byCreator).map(([name, count]) => ({ name, count }));

  const ChartCard = ({ title, icon: Icon, children }) => (
    <Card className="h-100 border-0">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Icon size={20} className="text-primary me-2" />
          <Card.Title className="mb-0 h6">{title}</Card.Title>
        </div>
        {children}
      </Card.Body>
    </Card>
  );

  return (
    <div className="my-4">
      <h5 className="mb-3 d-flex align-items-center">
        <FiBarChart2 className="me-2 text-primary" />
        Task Analytics
      </h5>
      
      <Row className="g-3 mb-3">
        <Col xs={12} md={6}>
          <ChartCard title="Status Distribution" icon={FiPieChart}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0c1427', border: '1px solid #1f2937', borderRadius: '8px', color: '#e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>

        <Col xs={12} md={6}>
          <ChartCard title="Attachments" icon={FiPieChart}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={attachmentData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value"
                >
                  {attachmentData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0c1427', border: '1px solid #1f2937', borderRadius: '8px', color: '#e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} md={6}>
          <ChartCard title="Tasks by Assignee" icon={FiBarChart2}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={assigneeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0c1427', border: '1px solid #1f2937', borderRadius: '8px' }} labelStyle={{ color: '#e5e7eb' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>

        <Col xs={12} md={6}>
          <ChartCard title="Tasks by Creator" icon={FiBarChart2}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={creatorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0c1427', border: '1px solid #1f2937', borderRadius: '8px' }} labelStyle={{ color: '#e5e7eb' }} />
                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
      </Row>
    </div>
  );
}
