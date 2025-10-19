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
