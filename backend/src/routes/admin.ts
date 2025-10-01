import express from 'express';
import {
  getDashboardStats,
  getAllUsersAdmin,
  updateUserRole,
  getActivityLog,
  deleteUser,
  getPlatformStats,
  getLoginHistory,
  getLoginStats
} from '../controllers/adminController';
import { protect, adminOnly, trackActivity } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(protect);
router.use(adminOnly);
router.use(trackActivity);

// Dashboard and statistics
router.get('/dashboard', getDashboardStats);
router.get('/stats/platform', getPlatformStats);
router.get('/activity', getActivityLog);

// Login tracking
router.get('/login-history', getLoginHistory);
router.get('/login-stats', getLoginStats);

// User management
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
