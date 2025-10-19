import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

export async function register(req, res, next) {
  try {
    const { name, email, password,role } = req.body;
    const userRole = role && role === 'ADMIN' ? 'ADMIN' : 'USER';
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (rows.length) return res.status(409).json({ message: 'This email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', [name, email, hashed,userRole]);

    res.status(201).json({ message: 'Your account is registered successfully' });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials recheck the credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials recheck the credentials' });

    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ user: req.session.user });
  } catch (e) { next(e); }
}

export function logout(req, res) {
  req.session.destroy(() => res.json({ message: 'This user has logged out' }));
}

export function me(req, res) {
  res.json({ user: req.session.user || null });
}
