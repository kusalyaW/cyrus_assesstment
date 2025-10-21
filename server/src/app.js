import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import passport from './passport.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: config.clientOrigin || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);
export default app;
