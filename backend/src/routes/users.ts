import express from 'express';
import { getUsers, getUser, getUsersValidation } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getUsersValidation, getUsers);
router.get('/:id', getUser);

export default router;