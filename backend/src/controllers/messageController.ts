import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';
import mongoose from 'mongoose';

// Send a message to another user
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user?.id;

    // Validation
    if (!recipientId || !content) {
      res.status(400).json({
        success: false,
        error: 'Recipient ID and message content are required'
      });
      return;
    }

    if (!content.trim()) {
      res.status(400).json({
        success: false,
        error: 'Message content cannot be empty'
      });
      return;
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res.status(404).json({
        success: false,
        error: 'Recipient not found'
      });
      return;
    }

    // Cannot send message to yourself
    if (senderId === recipientId) {
      res.status(400).json({
        success: false,
        error: 'Cannot send message to yourself'
      });
      return;
    }

    // Create message
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content: content.trim()
    });

    // Populate sender and recipient details
    await message.populate('sender', 'username email');
    await message.populate('recipient', 'username email');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      details: error.message
    });
  }
};

// Get conversation with a specific user
export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
      return;
    }

    // Get all messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
      .populate('sender', 'username email')
      .populate('recipient', 'username email')
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      {
        sender: userId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error: any) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation',
      details: error.message
    });
  }
};

// Get all conversations (list of users you've chatted with)
export const getAllConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    // Get all unique users the current user has communicated with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { recipient: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(currentUserId)] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', new mongoose.Types.ObjectId(currentUserId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
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
          userId: '$_id',
          username: '$user.username',
          email: '$user.email',
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: conversations,
      count: conversations.length
    });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations',
      details: error.message
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    const unreadCount = await Message.countDocuments({
      recipient: currentUserId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount }
    });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unread count',
      details: error.message
    });
  }
};

// Mark message as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid message ID'
      });
      return;
    }

    const message = await Message.findOne({
      _id: messageId,
      recipient: currentUserId
    });

    if (!message) {
      res.status(404).json({
        success: false,
        error: 'Message not found'
      });
      return;
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error: any) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark message as read',
      details: error.message
    });
  }
};

// Delete a message (soft delete - only sender can delete)
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid message ID'
      });
      return;
    }

    const message = await Message.findOne({
      _id: messageId,
      sender: currentUserId
    });

    if (!message) {
      res.status(404).json({
        success: false,
        error: 'Message not found or you are not authorized to delete it'
      });
      return;
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message',
      details: error.message
    });
  }
};

// Get all users (for selecting who to message)
export const getAvailableUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;

    // Get all users except current user
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      'username email role createdAt'
    ).sort({ username: 1 });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error: any) {
    console.error('Error fetching available users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
};
