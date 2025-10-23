import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext.jsx';
import ThemeProvider from './context/ThemeContext.jsx';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TaskForm from './components/TaskForm.jsx'; 
import TaskEditPage from './pages/TaskEditPage';
import UserListPage from './pages/UserListPage.jsx';
import UserEditPage from './pages/UserEditPage.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';
import AccountPage from './pages/AccountPage.jsx';
import Layout from './components/Layout.jsx';

function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/" element={<PrivateRoute><App /></PrivateRoute>} />
              <Route path="/dashboard/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/dashboard/edit/:id" element={<PrivateRoute><TaskEditPage /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
              <Route path="/admin/users/edit/:id" element={<PrivateRoute><UserEditPage /></PrivateRoute>} />
              <Route path="/account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
