import express from 'express';
import {
  sendMessage,
  getConversation,
  getAllConversations,
  getUnreadCount,
  markAsRead,
  deleteMessage,
  getAvailableUsers
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all available users to message
router.get('/users', getAvailableUsers);

// Get all conversations
router.get('/conversations', getAllConversations);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Get conversation with specific user
router.get('/conversation/:userId', getConversation);

// Send a message
router.post('/send', sendMessage);

// Mark message as read
router.patch('/:messageId/read', markAsRead);

// Delete a message
router.delete('/:messageId', deleteMessage);

export default router;
