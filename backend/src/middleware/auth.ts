import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'No user found with this token'
        });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
      return;
    }

    next();
  };
};

// Middleware to ensure only admins can access
export const adminOnly = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Track active sessions (in production, use Redis or similar)
interface ActiveSession {
  userId: string;
  username: string;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

const activeSessions = new Map<string, ActiveSession>();

// Middleware to track user activity
export const trackActivity = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user) {
    const sessionKey = req.user._id.toString();
    const session = activeSessions.get(sessionKey);
    
    if (session) {
      session.lastActivity = new Date();
    } else {
      activeSessions.set(sessionKey, {
        userId: req.user._id.toString(),
        username: req.user.name,
        email: req.user.email,
        loginTime: new Date(),
        lastActivity: new Date(),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    }
  }
  next();
};

// Helper function to get active sessions (for admin use)
export const getActiveSessions = (): ActiveSession[] => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  // Filter out inactive sessions (no activity in last 5 minutes)
  const activeSessionsArray: ActiveSession[] = [];
  activeSessions.forEach((session, key) => {
    if (session.lastActivity > fiveMinutesAgo) {
      activeSessionsArray.push(session);
    } else {
      // Clean up inactive sessions
      activeSessions.delete(key);
    }
  });
  
  return activeSessionsArray;
};

// Remove session on logout
export const removeSession = (userId: string): void => {
  activeSessions.delete(userId);
};