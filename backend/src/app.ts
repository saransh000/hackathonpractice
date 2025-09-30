import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Import routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import boardRoutes from './routes/boards';
import userRoutes from './routes/users';

const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Hackathon Helper API is running!',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/boards', boardRoutes);
  app.use('/api/users', userRoutes);

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;