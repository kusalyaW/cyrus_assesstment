import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FiUser, FiLogOut, FiActivity, FiSettings, FiHome, FiUsers, FiPlus, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

import Footer from './Footer.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return children;

  return (
    <div className="app d-flex flex-column min-vh-100">
      <Navbar sticky="top" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }} className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center bg-gradient rounded" 
                 style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)' }}>
              <FiActivity size={22} color="white" />
            </div>
            <span className="fw-bold">Task Manager</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                onClick={() => navigate('/')} 
                active={location.pathname === '/'}
              >
                <FiHome size={16} className="me-1" />
                <span className="d-lg-inline">Dashboard</span>
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/dashboard/new')}
                active={location.pathname === '/dashboard/new'}
              >
                <FiPlus size={16} className="me-1" />
                <span className="d-lg-inline">New Task</span>
              </Nav.Link>
              {user.role === 'ADMIN' && (
                <Nav.Link 
                  onClick={() => navigate('/admin/users')}
                  active={location.pathname === '/admin/users'}
                >
                  <FiUsers size={16} className="me-1" />
                  <span className="d-lg-inline">Manage Users</span>
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              <Button
                variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
                size="sm"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                className="me-3 d-flex align-items-center gap-2 rounded-pill px-3"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <>
                    <FiMoon size={16} />
                    <span className="d-none d-md-inline">Dark</span>
                  </>
                ) : (
                  <>
                    <FiSun size={16} />
                    <span className="d-none d-md-inline">Light</span>
                  </>
                )}
              </Button>
              <NavDropdown 
                title={
                  <span className="d-flex align-items-center gap-2">
                    <FiUser size={18} />
                    <span>{user.name}</span>
                    <span className="badge bg-primary">{user.role}</span>
                  </span>
                } 
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  <small className="text-muted">{user.email}</small>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate('/account')}>
                  <FiSettings size={16} className="me-2" />
                  Account Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <FiLogOut size={16} className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="flex-grow-1">
        <Container className="py-3">
          {children}
        </Container>
      </div>
      <Footer />
    </div>
  );
}
