import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { createTask, listTasks, updateTask, deleteTask,getTask } from '../controllers/task.controller.js';
import { pool } from '../db.js';

const upload = multer({ dest: 'uploads/' });
const r = Router();
r.use(requireAuth);

r.get('/', listTasks);
r.post('/', createTask);
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

export default r;
