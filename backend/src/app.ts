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
import teamRoutes from './routes/teams';

const createApp = () => {
  const app = express();

  // Security & Performance Middleware
  app.use(helmet());
  app.use(compression());
  
  // CORS configuration - flexible for development and production
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or same-origin)
      if (!origin) return callback(null, true);
      
      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // In production, check allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  app.use('/api/teams', teamRoutes);

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;