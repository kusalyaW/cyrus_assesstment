import { pool } from '../db.js';
export async function listUsers(_req, res, next) {
  try {
    const [rows] = await pool.query('SELECT id,name,email,role,created_at FROM users');
    res.json(rows);
  } catch (e) { next(e); }
}
export async function getUser(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id,name,email,role,created_at FROM users WHERE id=?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
}

export async function updateUser(req, res, next) {
  try {
    const id = req.params.id;
    const { name, email, role } = req.body;
    const [result] = await pool.query(
      'UPDATE users SET name=?, email=?, role=? WHERE id=?',
      [name, email, role, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ id, name, email, role });
  } catch (e) { next(e); }
}

export async function deleteUser(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (e) { next(e); }
}

