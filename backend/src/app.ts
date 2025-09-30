import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { apiLimiter, authLimiter, adminLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import boardRoutes from './routes/boards';
import userRoutes from './routes/users';
import adminRoutes from './routes/admin';
import messageRoutes from './routes/messages';

const createApp = () => {
  const app = express();

  // Security & Performance Middleware
  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  }));
  
  // Rate limiting
  app.use('/api/', apiLimiter);
  
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

  // API Routes with specific rate limiting
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/boards', boardRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminLimiter, adminRoutes);
  app.use('/api/messages', messageRoutes);

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;