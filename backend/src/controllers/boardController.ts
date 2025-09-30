import { Request, Response, NextFunction } from 'express';
import { body, validationResult, query } from 'express-validator';
import { Board } from '../models/Board';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { ApiResponse, CreateBoardRequest, UpdateBoardRequest, BoardQuery } from '../types';

// @desc    Get all boards
// @route   GET /api/boards
// @access  Private
export const getBoards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      isPublic
    }: BoardQuery = req.query;

    // Build query - show boards created by user or where user is a team member
    const queryObj: any = {
      $or: [
        { createdBy: req.user!._id },
        { teamMembers: req.user!._id }
      ]
    };

    if (isPublic !== undefined) {
      queryObj.isPublic = isPublic;
    }

    // Pagination
    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Execute query
    const boards = await Board.find(queryObj)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar')
      .sort(sort)
      .limit(limitNum)
      .skip(startIndex);

    const total = await Board.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: boards.length,
      data: boards,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        totalCount: total
      }
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Get single board with tasks
// @route   GET /api/boards/:id
// @access  Private
export const getBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar');

    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    // Check if user has access to this board
    const hasAccess = board.createdBy._id.equals(req.user!._id) || 
                      board.teamMembers.some(member => member._id.equals(req.user!._id)) ||
                      board.isPublic;

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this board'
      } as ApiResponse);
      return;
    }

    // Get tasks for this board
    const tasks = await Task.find({ board: board._id })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ column: 1, position: 1 });

    // Organize tasks by columns
    const organizedTasks: { [key: string]: any[] } = {};
    board.columns.forEach(column => {
      organizedTasks[column.id] = tasks.filter(task => task.column === column.id);
    });

    res.status(200).json({
      success: true,
      data: {
        ...board.toObject(),
        tasks: organizedTasks
      }
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
export const createBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const {
      title,
      description,
      teamMembers = [],
      isPublic = false
    }: CreateBoardRequest = req.body;

    // Validate team members exist
    if (teamMembers.length > 0) {
      const validMembers = await User.find({ _id: { $in: teamMembers } });
      if (validMembers.length !== teamMembers.length) {
        res.status(400).json({
          success: false,
          error: 'One or more team members not found'
        } as ApiResponse);
        return;
      }
    }

    // Create board
    const board = await Board.create({
      title,
      description,
      teamMembers,
      isPublic,
      createdBy: req.user!._id
    });

    const populatedBoard = await Board.findById(board._id)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedBoard
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
export const updateBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    let board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the owner of this board
    if (!board.createdBy.equals(req.user!._id)) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this board'
      } as ApiResponse);
      return;
    }

    const updateData: UpdateBoardRequest = req.body;

    // Validate team members if provided
    if (updateData.teamMembers && updateData.teamMembers.length > 0) {
      const validMembers = await User.find({ _id: { $in: updateData.teamMembers } });
      if (validMembers.length !== updateData.teamMembers.length) {
        res.status(400).json({
          success: false,
          error: 'One or more team members not found'
        } as ApiResponse);
        return;
      }
    }

    board = await Board.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar');

    res.status(200).json({
      success: true,
      data: board
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
export const deleteBoard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the owner of this board
    if (!board.createdBy.equals(req.user!._id)) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this board'
      } as ApiResponse);
      return;
    }

    // Delete all tasks in this board first
    await Task.deleteMany({ board: req.params.id });

    // Delete the board
    await Board.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Board and all associated tasks deleted successfully'
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Add team member to board
// @route   POST /api/boards/:id/members
// @access  Private
export const addTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      } as ApiResponse);
      return;
    }

    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the owner of this board
    if (!board.createdBy.equals(req.user!._id)) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to add members to this board'
      } as ApiResponse);
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
      return;
    }

    // Check if user is already a member
    if (board.teamMembers.includes(userId)) {
      res.status(400).json({
        success: false,
        error: 'User is already a team member'
      } as ApiResponse);
      return;
    }

    board.teamMembers.push(userId);
    await board.save();

    const updatedBoard = await Board.findById(board._id)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar');

    res.status(200).json({
      success: true,
      data: updatedBoard
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Remove team member from board
// @route   DELETE /api/boards/:id/members/:userId
// @access  Private
export const removeTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;

    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    // Check if user is the owner of this board
    if (!board.createdBy.equals(req.user!._id)) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to remove members from this board'
      } as ApiResponse);
      return;
    }

    // Remove user from team members
    board.teamMembers = board.teamMembers.filter(member => !member.equals(userId));
    await board.save();

    const updatedBoard = await Board.findById(board._id)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar');

    res.status(200).json({
      success: true,
      data: updatedBoard
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// Validation middleware
export const createBoardValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array')
    .custom((value) => {
      if (value && value.length > 0) {
        return value.every((id: string) => typeof id === 'string' && id.length === 24);
      }
      return true;
    })
    .withMessage('All team member IDs must be valid MongoDB ObjectIds'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

export const updateBoardValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('columns')
    .optional()
    .isArray()
    .withMessage('Columns must be an array'),
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

export const getBoardsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];