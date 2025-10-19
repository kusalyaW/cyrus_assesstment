const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export async function api(path, { method='GET', body, files } = {}) {
  const opts = { method, credentials: 'include', headers: {} };
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
  return data.data || [];
};

export const createTask = async (task) => {
  return await api('/tasks', { method: 'POST', body: task });
};

export const updateTask = async (id, updates) => {
  return await api(`/tasks/${id}`, { method: 'PATCH', body: updates });
};

export const deleteTask = async (id) => {
  return await api(`/tasks/${id}`, { method: 'DELETE' });
};

