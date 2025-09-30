import { Request, Response, NextFunction } from 'express';
import { body, validationResult, query } from 'express-validator';
import { Task } from '../models/Task';
import { Board } from '../models/Board';
import { ApiResponse, CreateTaskRequest, UpdateTaskRequest, TaskQuery } from '../types';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      board,
      status,
      priority,
      assignedTo,
      column,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    }: TaskQuery = req.query;

    // Build query
    const queryObj: any = {};
    
    if (board) queryObj.board = board;
    if (status) queryObj.status = status;
    if (priority) queryObj.priority = priority;
    if (assignedTo) queryObj.assignedTo = assignedTo;
    if (column) queryObj.column = column;

    // Only show tasks from boards the user has access to
    const userBoards = await Board.find({
      $or: [
        { createdBy: req.user!._id },
        { teamMembers: req.user!._id }
      ]
    }).select('_id');

    const boardIds = userBoards.map(board => board._id);
    queryObj.board = { $in: boardIds };

    // Pagination
    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Execute query
    const tasks = await Task.find(queryObj)
      .populate('assignedTo', 'name email avatar')
      .populate('board', 'title')
      .populate('createdBy', 'name email')
      .sort(sort)
      .limit(limitNum)
      .skip(startIndex);

    const total = await Task.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
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

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('board', 'title')
      .populate('createdBy', 'name email');

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      } as ApiResponse);
      return;
    }

    // Check if user has access to this task's board
    const board = await Board.findById(task.board);
    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    const hasAccess = board.createdBy.equals(req.user!._id) || 
                      board.teamMembers.some(member => member.equals(req.user!._id));

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this task'
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: task
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      priority = 'medium',
      dueDate,
      assignedTo,
      teamMember,
      column = 'todo',
      boardId
    }: CreateTaskRequest = req.body;

    // Check if board exists and user has access
    const board = await Board.findById(boardId);
    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    const hasAccess = board.createdBy.equals(req.user!._id) || 
                      board.teamMembers.some(member => member.equals(req.user!._id));

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to create tasks in this board'
      } as ApiResponse);
      return;
    }

    // Get the position for the new task (last in the column)
    const tasksInColumn = await Task.find({ board: boardId, column }).sort({ position: -1 }).limit(1);
    const position = tasksInColumn.length > 0 ? tasksInColumn[0].position + 1 : 0;

    // Create task
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo,
      teamMember,
      column,
      position,
      board: boardId,
      createdBy: req.user!._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('board', 'title')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedTask
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      } as ApiResponse);
      return;
    }

    // Check if user has access to this task's board
    const board = await Board.findById(task.board);
    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    const hasAccess = board.createdBy.equals(req.user!._id) || 
                      board.teamMembers.some(member => member.equals(req.user!._id));

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to update this task'
      } as ApiResponse);
      return;
    }

    const updateData: UpdateTaskRequest = req.body;

    // If moving to a different column, update position
    if (updateData.column && updateData.column !== task.column) {
      const tasksInNewColumn = await Task.find({ board: task.board, column: updateData.column }).sort({ position: -1 }).limit(1);
      updateData.position = tasksInNewColumn.length > 0 ? tasksInNewColumn[0].position + 1 : 0;
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email avatar')
      .populate('board', 'title')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: task
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      } as ApiResponse);
      return;
    }

    // Check if user has access to this task's board
    const board = await Board.findById(task.board);
    if (!board) {
      res.status(404).json({
        success: false,
        error: 'Board not found'
      } as ApiResponse);
      return;
    }

    const hasAccess = board.createdBy.equals(req.user!._id) || 
                      board.teamMembers.some(member => member.equals(req.user!._id));

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to delete this task'
      } as ApiResponse);
      return;
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Task deleted successfully'
    } as ApiResponse);

  } catch (error) {
    next(error);
  }
};

// Validation middleware
export const createTaskValidation = [
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
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('column')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Column cannot be empty'),
  body('boardId')
    .notEmpty()
    .withMessage('Board ID is required')
    .isMongoId()
    .withMessage('Board ID must be a valid MongoDB ObjectId')
];

export const updateTaskValidation = [
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
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a non-negative integer')
];

export const getTasksValidation = [
  query('board')
    .optional()
    .isMongoId()
    .withMessage('Board ID must be a valid MongoDB ObjectId'),
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];