import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { User } from '../models/User';
import { ApiResponse } from '../types';

// @desc    Get all users (for team member selection)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      } as ApiResponse);
      return;
    }

    const { search, limit = 20 } = req.query;

    // Build query
    const queryObj: any = {};
    
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const users = await User.find(queryObj)
      .select('name email avatar role')
      .limit(parseInt(limit.toString(), 10))
      .sort('name');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('name email avatar role createdAt');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: user
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// Validation middleware
export const getUsersValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search query must be between 1 and 50 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];