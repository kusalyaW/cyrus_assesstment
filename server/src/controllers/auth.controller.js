import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { config } from '../config.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const userRole = role && role === 'ADMIN' ? 'ADMIN' : 'USER';
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });

    const [rows] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (rows.length) return res.status(409).json({ message: 'This email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', [name, email, hashed, userRole]);

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

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Return user data and token
    res.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token 
    });
  } catch (e) { next(e); }
}

export function logout(req, res) {
  // With JWT, logout is handled on the client side by removing the token
  res.json({ message: 'This user has logged out' });
}

export function me(req, res) {
  // User data is now attached to req.user by the auth middleware
  res.json({ user: req.user || null });
}

// Google OAuth callback handler
export function googleCallback(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${config.clientOrigin}/login?error=oauth_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Redirect to frontend with token
    res.redirect(`${config.clientOrigin}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${config.clientOrigin}/login?error=oauth_failed`);
  }
}
