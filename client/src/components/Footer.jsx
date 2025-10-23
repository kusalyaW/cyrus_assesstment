import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer mt-4 py-3">
      <Container fluid className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="text-muted small">
          © {year} <strong>Task Manager</strong>. All rights reserved.
        </div>
        <div className="text-muted small">
          <span className="me-3">Built with React & Bootstrap</span>
          <a href="#" className="text-decoration-none me-3">Privacy</a>
          <a href="#" className="text-decoration-none">Terms</a>
        </div>
      </Container>
    </footer>
  );
}
