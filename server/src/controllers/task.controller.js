import { pool } from '../db.js';

export async function createTask(req, res, next) {
  try {
    const { title, description, status, assignee_id, due_date } = req.body;
    
    // If no assignee is specified, assign to the creator by default
    const finalAssigneeId = assignee_id || req.user.id;
    
    // Create the task
    const [result] = await pool.query(
      `INSERT INTO tasks (title, description, status, assignee_id, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || null, status || 'PENDING', finalAssigneeId, due_date || null, req.user.id]
    );
    
    const taskId = result.insertId;
    
    // If file was uploaded, save attachment metadata
    if (req.file) {
      await pool.query(
        `INSERT INTO attachments (task_id, filename, mimetype, size_bytes) VALUES (?, ?, ?, ?)`,
        [taskId, req.file.filename, req.file.mimetype, req.file.size]
      );
    }
    
    const [task] = await pool.query('SELECT * FROM tasks WHERE id=?', [taskId]);
    res.status(201).json(task[0]);
  } catch (e) { 
    next(e); 
  }
}

export async function listTasks(req, res, next) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;


    const { status, q, page = 1, pageSize = 10 } = req.query;
    const where = [];
    const values = [];
    if (status) { where.push('status=?'); values.push(status); }
    if (q) { where.push('(title LIKE ? OR description LIKE ?)'); values.push(`%${q}%`, `%${q}%`); }
    if (userRole !== 'ADMIN') {
      where.push('(created_by=? OR assignee_id=?)');
      values.push(userId, userId);
    }
    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';
    const offset = (page - 1) * pageSize;

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM tasks ${whereSql}`, values);
    const [rows] = await pool.query(
      `SELECT t.*, u.name AS assignee_name, c.name AS creator_name,
       (SELECT COUNT(*) FROM attachments WHERE task_id = t.id) as attachment_count
       FROM tasks t LEFT JOIN users u ON t.assignee_id=u.id
       LEFT JOIN users c ON t.created_by=c.id
       ${whereSql} ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [...values, parseInt(pageSize), parseInt(offset)]
    );
    res.json({ data: rows, meta: { total: countRows[0].total, page: +page, pageSize: +pageSize } });
  } catch (e) { next(e); }
}

export async function updateTask(req, res, next) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    const task = rows[0]; 
    const isOwner = task.created_by === userId || task.assignee_id === userId || userRole === 'ADMIN';
    if (!isOwner) return res.status(403).json({ message: 'this user is not allowed to update this task' });
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
    const id = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    const task = rows[0];
    const isOwner = task.created_by === userId || userRole === 'ADMIN' || task.assignee_id === userId || task.created_by === userId;
    if (!isOwner) return res.status(403).json({ message: 'this user is not allowed to delete this task' });
    await pool.query('DELETE FROM tasks WHERE id=?', [id]);
    res.status(204).end();
  } catch (e) { next(e); }
}

export async function getTask(req, res, next) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query, params;
    if (userRole === 'ADMIN') {
      query = `SELECT t.*, u.name AS assignee_name
                FROM tasks t LEFT JOIN users u ON t.assignee_id=u.id
                WHERE t.id=?`;
      params = [req.params.id];
    } else {
      query = `SELECT t.*, u.name AS assignee_name
                FROM tasks t LEFT JOIN users u ON t.assignee_id=u.id
                WHERE t.id=? AND (t.created_by=? OR t.assignee_id=?)`;
      params = [req.params.id, userId, userId];
    }
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found or not access' });
    
    // Fetch attachments for this task
    const [attachments] = await pool.query(
      'SELECT id, filename, mimetype, size_bytes, created_at FROM attachments WHERE task_id=?',
      [req.params.id]
    );
    
    const task = rows[0];
    task.attachments = attachments;
    res.json(task);
  } catch (e) { next(e); } 
}