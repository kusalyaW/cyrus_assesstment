const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export async function api(path, { method='GET', body, files } = {}) {
  const opts = { method, credentials: 'include', headers: {} };
  
  // Add Authorization header with JWT token
  const token = getToken();
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (files) {
    const form = new FormData();
    for (const [k,v] of Object.entries(files)) form.append(k,v);
    opts.body = form;
  } else if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) throw new Error((await res.json()).message || res.statusText);
  return res.json().catch(() => ({}));
}

export const fetchTasks = async (query = '') => {
  const data = await api(`/tasks${query}`);
  return data; // Return full response with data and meta
};

export const createTask = async (task) => {
  // If task has a file, send as FormData
  if (task.file) {
    const formData = new FormData();
    formData.append('title', task.title);
    formData.append('description', task.description || '');
    formData.append('status', task.status || 'PENDING');
    if (task.assignee_id) formData.append('assignee_id', task.assignee_id);
    if (task.due_date) formData.append('due_date', task.due_date);
    formData.append('attachment', task.file);
    
    const token = getToken();
    const opts = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    };
    const res = await fetch(`${API}/tasks`, opts);
    if (!res.ok) throw new Error((await res.json()).message || res.statusText);
    return res.json().catch(() => ({}));
  }
  
  // Otherwise send as regular JSON
  return await api('/tasks', { method: 'POST', body: task });
};

export const updateTask = async (id, updates) => {
  return await api(`/tasks/${id}`, { method: 'PATCH', body: updates });
};

export const deleteTask = async (id) => {
  return await api(`/tasks/${id}`, { method: 'DELETE' });
};

