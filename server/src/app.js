import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { pool } from './db.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

import { errorHandler } from './middleware/error.js';

const MySQLSessionStore = MySQLStore(session);
const store = new MySQLSessionStore({}, pool);

const app = express();
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use(session({
  key: 'sid',
  secret: config.sessionSecret,
  store,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


app.use(errorHandler);
export default app;
