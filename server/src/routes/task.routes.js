import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middleware/auth.js';
import { createTask, listTasks, updateTask, deleteTask,getTask } from '../controllers/task.controller.js';
import { pool } from '../db.js';

const upload = multer({ dest: 'uploads/' });
const r = Router();
r.use(requireAuth);

r.get('/', listTasks);
r.post('/', upload.single('attachment'), createTask);
r.patch('/:id', updateTask);
r.delete('/:id', deleteTask);
r.get('/:id', getTask);

r.post('/:id/attachments', upload.single('file'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filename, mimetype, size } = req.file;
    await pool.query(
      `INSERT INTO attachments (task_id, filename, mimetype, size_bytes) VALUES (?,?,?,?)`,
      [id, filename, mimetype, size]
    );
    res.status(201).json({ message: 'Uploaded' });
  } catch (e) { next(e); }
});

// Download attachment
r.get('/attachments/:id/download', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM attachments WHERE id=?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Attachment not found' });
    }
    const attachment = rows[0];
    const filepath = path.join(process.cwd(), 'uploads', attachment.filename);
    res.download(filepath, attachment.filename);
  } catch (e) {
    next(e);
  }
});

export default r;
