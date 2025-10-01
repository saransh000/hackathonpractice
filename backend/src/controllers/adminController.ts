import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Board } from '../models/Board';
import { Task } from '../models/Task';
import LoginSession from '../models/LoginSession';
import { getActiveSessions } from '../middleware/auth';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Admin only
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get active sessions
    const activeSessions = getActiveSessions();
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get users registered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Get users registered this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });
    
    // Get total boards
    const totalBoards = await Board.countDocuments();
    
    // Get active boards (boards with tasks updated in last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activeBoards = await Board.countDocuments({
      updatedAt: { $gte: yesterday }
    });
    
    // Get total tasks
    const totalTasks = await Task.countDocuments();
    
    // Get tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get tasks by priority
    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get most active users (users with most tasks)
    const mostActiveUsers = await Task.aggregate([
      {
        $group: {
          _id: '$assignee',
          taskCount: { $sum: 1 }
        }
      },
      { $sort: { taskCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          userId: '$_id',
          taskCount: 1,
          name: { $arrayElemAt: ['$userInfo.name', 0] },
          email: { $arrayElemAt: ['$userInfo.email', 0] }
        }
      }
    ]);
    
    // Get user roles distribution
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate completion rate
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : '0.00';
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsersToday,
          newUsersThisWeek,
          totalBoards,
          activeBoards,
          totalTasks,
          completionRate: `${completionRate}%`
        },
        activeSessions: {
          count: activeSessions.length,
          sessions: activeSessions.map(session => ({
            username: session.username,
            email: session.email,
            loginTime: session.loginTime,
            lastActivity: session.lastActivity,
            duration: Math.floor((new Date().getTime() - session.loginTime.getTime()) / 1000 / 60), // minutes
            isActive: true
          }))
        },
        taskAnalytics: {
          byStatus: tasksByStatus,
          byPriority: tasksByPriority,
          total: totalTasks,
          completed: completedTasks,
          pending: totalTasks - completedTasks
        },
        userAnalytics: {
          byRole: usersByRole,
          mostActive: mostActiveUsers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with details (admin view)
// @route   GET /api/admin/users
// @access  Admin only
export const getAllUsersAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    // Get task count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const taskCount = await Task.countDocuments({ assignee: user._id });
        const completedTasks = await Task.countDocuments({ 
          assignee: user._id, 
          status: 'completed' 
        });
        const boards = await Board.countDocuments({ 
          teamMembers: user._id 
        });
        
        return {
          ...user.toObject(),
          stats: {
            totalTasks: taskCount,
            completedTasks,
            activeBoards: boards,
            completionRate: taskCount > 0 ? ((completedTasks / taskCount) * 100).toFixed(2) : '0'
          }
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote/demote)
// @route   PUT /api/admin/users/:id/role
// @access  Admin only
export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'member'].includes(role)) {
      res.status(400).json({
        success: false,
        error: 'Invalid role. Must be either "admin" or "member"'
      });
      return;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system activity log
// @route   GET /api/admin/activity
// @access  Admin only
export const getActivityLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get recent boards (last 20)
    const recentBoards = await Board.find()
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate('createdBy', 'name email')
      .populate('teamMembers', 'name email');
    
    // Get recent tasks (last 20)
    const recentTasks = await Task.find()
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');
    
    // Get recent users (last 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');
    
    // Create activity timeline
    const activities: any[] = [];
    
    recentBoards.forEach(board => {
      activities.push({
        type: 'board',
        action: board.createdAt.getTime() === board.updatedAt.getTime() ? 'created' : 'updated',
        timestamp: board.updatedAt,
        user: board.createdBy,
        details: {
          boardTitle: board.title,
          teamSize: board.teamMembers.length
        }
      });
    });
    
    recentTasks.forEach(task => {
      activities.push({
        type: 'task',
        action: task.createdAt.getTime() === task.updatedAt.getTime() ? 'created' : 'updated',
        timestamp: task.updatedAt,
        user: task.createdBy || task.assignedTo,
        details: {
          taskTitle: task.title,
          status: task.status,
          priority: task.priority
        }
      });
    });
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        action: 'registered',
        timestamp: user.createdAt,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        details: {
          role: user.role
        }
      });
    });
    
    // Sort by timestamp descending
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities.slice(0, 30) // Return top 30 activities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Admin only
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user?._id.toString()) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
      return;
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    // Delete user's tasks
    await Task.deleteMany({ assignee: user._id });
    
    // Remove user from all boards
    await Board.updateMany(
      { teamMembers: user._id },
      { $pull: { teamMembers: user._id } }
    );
    
    // Delete user
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats/platform
// @access  Admin only
export const getPlatformStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Growth metrics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const taskGrowth = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const boardGrowth = await Board.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        growth: {
          users: userGrowth,
          tasks: taskGrowth,
          boards: boardGrowth
        },
        period: '30 days'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get login history
// @route   GET /api/admin/login-history
// @access  Admin only
export const getLoginHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Get login sessions with user details
    const sessions = await LoginSession.find()
      .populate('user', 'name email role avatar')
      .sort({ loginTime: -1 })
      .limit(limit)
      .skip(skip);

    const totalSessions = await LoginSession.countDocuments();

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        total: totalSessions,
        page,
        limit,
        pages: Math.ceil(totalSessions / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get login statistics
// @route   GET /api/admin/login-stats
// @access  Admin only
export const getLoginStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get total logins
    const totalLogins = await LoginSession.countDocuments();

    // Get active sessions (not logged out)
    const activeSessions = await LoginSession.countDocuments({ isActive: true });

    // Get logins today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loginsToday = await LoginSession.countDocuments({
      loginTime: { $gte: today }
    });

    // Get logins this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const loginsThisWeek = await LoginSession.countDocuments({
      loginTime: { $gte: weekAgo }
    });

    // Get unique users who logged in today
    const uniqueUsersToday = await LoginSession.distinct('user', {
      loginTime: { $gte: today }
    });

    // Get average session duration
    const avgSessionData = await LoginSession.aggregate([
      {
        $match: {
          sessionDuration: { $ne: null, $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$sessionDuration' }
        }
      }
    ]);

    const avgSessionDuration = avgSessionData.length > 0 
      ? Math.round(avgSessionData[0].avgDuration) 
      : 0;

    // Get login activity by hour (last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const loginsByHour = await LoginSession.aggregate([
      {
        $match: {
          loginTime: { $gte: twentyFourHoursAgo }
        }
      },
      {
        $group: {
          _id: {
            $hour: '$loginTime'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get most active users (top 10)
    const mostActiveUsers = await LoginSession.aggregate([
      {
        $group: {
          _id: '$user',
          loginCount: { $sum: 1 },
          lastLogin: { $max: '$loginTime' }
        }
      },
      { $sort: { loginCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          _id: 1,
          loginCount: 1,
          lastLogin: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          role: '$userInfo.role'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLogins,
        activeSessions,
        loginsToday,
        loginsThisWeek,
        uniqueUsersToday: uniqueUsersToday.length,
        avgSessionDuration,
        loginsByHour,
        mostActiveUsers
      }
    });
  } catch (error) {
    next(error);
  }
};
