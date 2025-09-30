# 💬 Team Messaging Feature

## Overview
Real-time messaging system that allows team members to communicate directly within the Hackathon Helper Tool. Messages are stored in MongoDB and auto-refresh every 5 seconds.

---

## 🎯 Features

### ✅ What's Included:
- **Direct Messaging**: Send messages to any team member
- **Conversation History**: View full message history with each user
- **Unread Count**: Badge shows number of unread messages
- **Real-time Updates**: Messages auto-refresh every 5 seconds
- **Read Receipts**: Track when messages are read
- **User List**: Browse all team members to start conversations
- **Conversation List**: See all active conversations with last message preview
- **Beautiful UI**: Floating chat button with sleek messaging panel
- **Dark Mode Support**: Works seamlessly with light/dark themes

---

## 🚀 How to Use

### For Users:

1. **Open Messaging Panel**
   - Click the floating message button (bottom-right corner)
   - Badge shows unread message count

2. **Start New Conversation**
   - Click "+ New Message" button
   - Select a user from the list
   - Type your message and hit Send (or press Enter)

3. **View Conversations**
   - Click on any conversation to open chat
   - Messages auto-refresh every 5 seconds
   - Back arrow returns to conversation list

4. **Message Features**
   - Max 1000 characters per message
   - Sent messages appear on right (blue/purple gradient)
   - Received messages appear on left (white/gray)
   - Timestamps show when message was sent
   - Unread indicators on conversation list

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api/messages`

All endpoints require authentication (Bearer token in Authorization header)

### 1. Get Available Users
**GET** `/users`

Get all users you can message (excludes yourself)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "member"
    }
  ],
  "count": 5
}
\`\`\`

---

### 2. Send Message
**POST** `/send`

Send a message to another user

**Request Body:**
\`\`\`json
{
  "recipientId": "user_id_here",
  "content": "Your message here"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "sender": {
      "_id": "sender_id",
      "username": "sender_name",
      "email": "sender@email.com"
    },
    "recipient": {
      "_id": "recipient_id",
      "username": "recipient_name",
      "email": "recipient@email.com"
    },
    "content": "Message text",
    "isRead": false,
    "createdAt": "2025-09-30T20:00:00.000Z"
  }
}
\`\`\`

---

### 3. Get Conversation
**GET** `/conversation/:userId`

Get all messages between you and a specific user

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "_id": "message_id",
      "sender": { "_id": "...", "username": "...", "email": "..." },
      "recipient": { "_id": "...", "username": "...", "email": "..." },
      "content": "Message content",
      "isRead": true,
      "readAt": "2025-09-30T20:05:00.000Z",
      "createdAt": "2025-09-30T20:00:00.000Z"
    }
  ],
  "count": 10
}
\`\`\`

**Note:** Automatically marks all received messages as read

---

### 4. Get All Conversations
**GET** `/conversations`

Get list of all users you've chatted with (sorted by most recent)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "userId": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "lastMessage": "Last message text",
      "lastMessageDate": "2025-09-30T20:00:00.000Z",
      "unreadCount": 3
    }
  ],
  "count": 5
}
\`\`\`

---

### 5. Get Unread Count
**GET** `/unread-count`

Get total number of unread messages

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
\`\`\`

---

### 6. Mark Message as Read
**PATCH** `/:messageId/read`

Manually mark a specific message as read

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "message_id",
    "isRead": true,
    "readAt": "2025-09-30T20:10:00.000Z"
  }
}
\`\`\`

---

### 7. Delete Message
**DELETE** `/:messageId`

Delete a message (only sender can delete)

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Message deleted successfully"
}
\`\`\`

---

## 🗄️ Database Schema

### Message Model
\`\`\`typescript
{
  sender: ObjectId,           // Reference to User
  recipient: ObjectId,         // Reference to User
  content: String,             // Max 1000 characters
  isRead: Boolean,             // Default: false
  readAt: Date,                // When message was read
  createdAt: Date,             // Auto-generated
  updatedAt: Date              // Auto-generated
}
\`\`\`

### Indexes:
- Compound index: `(sender, recipient, createdAt)`
- Index: `(recipient, isRead)` for unread queries

---

## 🎨 UI Components

### MessagingPanel Component
Located: `src/components/MessagingPanel.tsx`

**Features:**
- Floating button (bottom-right)
- Unread badge (red circle with count)
- Slide-in panel (96rem width, 600px height)
- Three views: Conversations List, User List, Chat View
- Auto-scroll to latest message
- Auto-refresh every 5 seconds
- Responsive design
- Dark mode support

**Usage:**
\`\`\`tsx
import { MessagingPanel } from './components/MessagingPanel';

// Add to your App.tsx
<MessagingPanel />
\`\`\`

---

## 🔧 Technical Details

### Backend:
- **Model**: `backend/src/models/Message.ts`
- **Controller**: `backend/src/controllers/messageController.ts`
- **Routes**: `backend/src/routes/messages.ts`
- **Registered in**: `backend/src/app.ts` as `/api/messages`

### Frontend:
- **Component**: `src/components/MessagingPanel.tsx`
- **Added to**: `src/App.tsx`
- **Dependencies**: axios (for API calls)

### Security:
- All endpoints require JWT authentication
- Users can only send/view their own messages
- Message content validated (max 1000 chars)
- Cannot message yourself

---

## 📊 Message Flow

1. **User A sends message**
   → POST `/api/messages/send`
   → Message stored in MongoDB
   → Response returns message with populated user data

2. **User B opens conversation**
   → GET `/api/messages/conversation/:userAId`
   → Fetches all messages
   → Auto-marks messages as read
   → Updates unread count

3. **Real-time Updates**
   → Every 5 seconds: GET `/api/messages/conversation/:userId`
   → Fetches new messages
   → Updates UI automatically

---

## 🎉 Testing the Feature

### Quick Test:

1. **Backend is running**: `http://localhost:5000`
2. **Frontend is running**: `http://localhost:5175`
3. **Login with two different users**:
   - Window 1: Login as `admin@hackathon.com`
   - Window 2: Login as `user@test.com` (or create another user)
4. **Send messages** between users
5. **Watch unread count** update in real-time
6. **Test features**:
   - Send message
   - View conversation history
   - Check unread badge
   - Open/close panel
   - Switch between conversations

---

## 🚀 What's Next?

Potential enhancements:
- WebSocket for instant message delivery
- Typing indicators
- Message reactions/emojis
- File/image attachments
- Group chats
- Push notifications
- Message search
- Voice/video calls

---

## 📝 Summary

✅ **Backend**: Complete message API with 7 endpoints
✅ **Frontend**: Beautiful messaging panel with auto-refresh
✅ **Database**: MongoDB with optimized indexes
✅ **Security**: JWT authentication required
✅ **UI/UX**: Floating button, unread badges, smooth animations
✅ **Real-time**: Auto-refresh every 5 seconds

**The messaging feature is fully functional and ready to use!** 🎊
