import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FiClock, FiTrendingUp, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function StatCards({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'PENDING').length;
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total Tasks', value: total, icon: FiAlertCircle, color: 'primary', bg: 'rgba(79, 70, 229, 0.1)' },
    { label: 'Pending', value: pending, icon: FiClock, color: 'warning', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'In Progress', value: inProgress, icon: FiTrendingUp, color: 'info', bg: 'rgba(14, 165, 233, 0.1)' },
    { label: 'Completed', value: completed, icon: FiCheckCircle, color: 'success', bg: 'rgba(34, 197, 94, 0.1)' },
  ];

  return (
    <Row className="g-3 mb-4">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <Col key={idx} xs={12} sm={6} lg={3}>
            <Card className="h-100 border-0">
              <Card.Body className="d-flex align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center rounded me-3"
                  style={{ width: 56, height: 56, background: stat.bg }}
                >
                  <IconComponent size={28} className={`text-${stat.color}`} />
                </div>
                <div>
                  <div className="text-muted small mb-1">{stat.label}</div>
                  <div className="h3 mb-0 fw-bold">{stat.value}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
