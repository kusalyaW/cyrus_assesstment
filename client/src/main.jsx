import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext.jsx';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TaskForm from './components/TaskForm.jsx'; 
import TaskEditPage from './pages/TaskEditPage';
import UserListPage from './pages/UserListPage.jsx';
import UserEditPage from './pages/UserEditPage.jsx';

function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/new" element={<TaskForm />} />
          <Route path="/dashboard/edit/:id" element={<TaskEditPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/users/edit/:id" element={<UserEditPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
