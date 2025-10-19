import { pool } from '../db.js';

export async function createTask(req, res, next) {
  try {
    const { title, description, status, assigneeId, dueDate } = req.body;
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, status, assignee_id, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || null, status || 'PENDING', assigneeId || null, dueDate || null, req.session.user.id]
    );
    const [task] = await pool.query('SELECT * FROM tasks WHERE id=?', [result.insertId]);
    res.status(201).json(task[0]);
  } catch (e) { next(e); }
}

export async function listTasks(req, res, next) {
  try {
    const { status, q, page = 1, pageSize = 10 } = req.query;
    const where = [];
    const values = [];
    if (status) { where.push('status=?'); values.push(status); }
    if (q) { where.push('(title LIKE ? OR description LIKE ?)'); values.push(`%${q}%`, `%${q}%`); }
    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const offset = (page - 1) * pageSize;

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM tasks ${whereSql}`, values);
    const [rows] = await pool.query(
      `SELECT t.*, u.name AS assignee_name
       FROM tasks t LEFT JOIN users u ON t.assignee_id=u.id
       ${whereSql} ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [...values, parseInt(pageSize), parseInt(offset)]
    );
    res.json({ data: rows, meta: { total: countRows[0].total, page: +page, pageSize: +pageSize } });
  } catch (e) { next(e); }
}

export async function updateTask(req, res, next) {
  try {
    const id = req.params.id;
    const fields = ['title','description','status','assignee_id','due_date'];
    const set = [];
    const vals = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        set.push(`${f}=?`);
        vals.push(req.body[f]);
      }
    }
    if (!set.length) return res.json({ message: 'No changes' });
    vals.push(id);
    await pool.query(`UPDATE tasks SET ${set.join(', ')} WHERE id=?`, vals);
    const [updated] = await pool.query('SELECT * FROM tasks WHERE id=?', [id]);
    res.json(updated[0]);
  } catch (e) { next(e); }
}

export async function deleteTask(req, res, next) {
  try {
    await pool.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.status(204).end();
  } catch (e) { next(e); }
}
