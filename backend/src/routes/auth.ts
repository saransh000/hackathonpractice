import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword,
  registerValidation, 
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.put('/reset-password/:resettoken', resetPasswordValidation, resetPassword);
router.get('/me', protect, getMe);

export default router;