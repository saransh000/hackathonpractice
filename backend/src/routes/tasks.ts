import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  createTaskValidation,
  updateTaskValidation,
  getTasksValidation
} from '../controllers/taskController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTasksValidation, getTasks)
  .post(createTaskValidation, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidation, updateTask)
  .delete(deleteTask);

export default router;