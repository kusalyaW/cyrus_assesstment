import { Router } from 'express';
import { listUsers } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getUser, updateUser, deleteUser } from '../controllers/user.controller.js';

const r = Router();
r.use(requireAuth, requireRole('ADMIN'));
r.get('/', listUsers);
r.get('/:id', getUser);
r.put('/:id', updateUser);
r.delete('/:id', deleteUser);
export default r;
