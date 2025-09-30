import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

// Middleware to check if user is admin
export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is authenticated (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Please log in first.'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    // User is admin, proceed to next middleware/controller
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Server error during admin verification',
      details: error.message
    });
  }
};

// Middleware to check if user is admin or accessing their own data
export const adminOrSelf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Please log in first.'
      });
    }

    // Allow if user is admin OR accessing their own data
    const isAdmin = req.user.role === 'admin';
    const isAccessingOwnData = req.params.id === req.user.id;

    if (!isAdmin && !isAccessingOwnData) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only access your own data.'
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Server error during authorization check',
      details: error.message
    });
  }
};