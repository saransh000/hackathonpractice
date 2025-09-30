import express from 'express';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/adminAuth';
import {
  getAllUsers,
  getUserById,
  getUserStats,
  updateUserRole,
  deleteUser,
  getTaskAnalytics,
  getBoardAnalytics,
  getSystemAnalytics
} from '../controllers/adminController';

const router = express.Router();

// Apply authentication to all admin routes
router.use(protect);
router.use(adminOnly);

// Admin user management routes
router.get('/users', getAllUsers);           // GET /api/admin/users
router.get('/users/stats', getUserStats);    // GET /api/admin/users/stats
router.get('/users/:id', getUserById);       // GET /api/admin/users/:id
router.put('/users/:id/role', updateUserRole); // PUT /api/admin/users/:id/role
router.delete('/users/:id', deleteUser);     // DELETE /api/admin/users/:id

// Admin analytics routes
router.get('/analytics/tasks', getTaskAnalytics);    // GET /api/admin/analytics/tasks
router.get('/analytics/boards', getBoardAnalytics);  // GET /api/admin/analytics/boards
router.get('/analytics/system', getSystemAnalytics); // GET /api/admin/analytics/system

export default router;