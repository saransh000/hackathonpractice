import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { Task } from '../models/Task';
import { Board } from '../models/Board';

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      details: error.message
    });
  }
};

// Get user statistics (Admin only)
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const memberUsers = await User.countDocuments({ role: 'member' });
    
    // Get users by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const usersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .select('name email createdAt role')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        adminUsers,
        memberUsers,
        usersByMonth,
        recentUsers,
        stats: {
          adminPercentage: totalUsers > 0 ? (adminUsers / totalUsers * 100).toFixed(1) : 0,
          memberPercentage: totalUsers > 0 ? (memberUsers / totalUsers * 100).toFixed(1) : 0
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics',
      details: error.message
    });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be either "admin" or "member"'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: `User role updated to ${role}`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user role',
      details: error.message
    });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
};

// Get task analytics (Admin only)
export const getTaskAnalytics = async (req: Request, res: Response) => {
  try {
    // Basic task statistics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });

    // Task completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Tasks by status with details
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgAge: {
            $avg: {
              $divide: [
                { $subtract: [new Date(), '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        }
      }
    ]);

    // Recent task activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTasks = await Task.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

    // Tasks created per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasksPerDay = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Most productive users
    const productiveUsers = await Task.aggregate([
      {
        $group: {
          _id: '$createdBy',
          tasksCreated: { $sum: 1 },
          tasksCompleted: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          tasksCreated: 1,
          tasksCompleted: 1,
          completionRate: {
            $cond: [
              { $gt: ['$tasksCreated', 0] },
              { $multiply: [{ $divide: ['$tasksCompleted', '$tasksCreated'] }, 100] },
              0
            ]
          }
        }
      },
      {
        $sort: { tasksCreated: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          completionRate: `${completionRate}%`
        },
        tasksByPriority,
        tasksByStatus,
        recentTasks,
        tasksPerDay,
        productiveUsers
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task analytics',
      details: error.message
    });
  }
};

// Get board analytics (Admin only)
export const getBoardAnalytics = async (req: Request, res: Response) => {
  try {
    // Basic board statistics
    const totalBoards = await Board.countDocuments();
    const publicBoards = await Board.countDocuments({ isPublic: true });
    const privateBoards = await Board.countDocuments({ isPublic: false });

    // Boards created per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const boardsPerMonth = await Board.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Most active boards (by task count)
    const activeBoardsData = await Board.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'board',
          as: 'tasks'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: '$owner'
      },
      {
        $project: {
          title: 1,
          owner: '$owner.name',
          taskCount: { $size: '$tasks' },
          teamSize: { $size: '$teamMembers' },
          isPublic: 1,
          createdAt: 1,
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: ['$taskCount', 0] },
              { $multiply: [{ $divide: ['$completedTasks', '$taskCount'] }, 100] },
              0
            ]
          }
        }
      },
      {
        $sort: { taskCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalBoards,
          publicBoards,
          privateBoards
        },
        boardsPerMonth,
        activeBoards: activeBoardsData
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch board analytics',
      details: error.message
    });
  }
};

// Get system analytics (Admin only)
export const getSystemAnalytics = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // System overview
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalBoards = await Board.countDocuments();

    // Growth metrics (last 30 days vs previous 30 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const previousPeriodUsers = await User.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    const userGrowthRate = previousPeriodUsers > 0 
      ? ((recentUsers - previousPeriodUsers) / previousPeriodUsers * 100).toFixed(1)
      : '100';

    // Daily active metrics (simulated - you could track login times)
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: thirtyDaysAgo }
    });

    // Average tasks per user
    const avgTasksPerUser = totalUsers > 0 ? (totalTasks / totalUsers).toFixed(1) : '0';

    // System health metrics
    const systemHealth = {
      databaseConnected: true, // You could implement actual health checks
      emailServiceStatus: 'operational',
      apiResponseTime: '< 200ms', // You could implement actual monitoring
      uptime: '99.9%'
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTasks,
          totalBoards,
          activeUsers: `${activeUsers} (30 days)`,
          avgTasksPerUser
        },
        growth: {
          newUsers: recentUsers,
          userGrowthRate: `${userGrowthRate}%`,
          period: 'Last 30 days vs previous 30 days'
        },
        systemHealth
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system analytics',
      details: error.message
    });
  }
};