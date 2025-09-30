# Admin Features Documentation

## Overview
Comprehensive admin privilege system with real-time session tracking, user management, analytics, and activity monitoring for the Hackathon Helper Tool.

## Features Implemented

### 1. **Real-Time Session Tracking** 🔴
Monitor who's currently logged in with live activity tracking.

**Capabilities:**
- Track active users in real-time
- Monitor login times and session duration
- Track last activity timestamp
- Capture IP address and user agent
- Auto-expire inactive sessions (5-minute window)
- In-memory session storage (production: Redis recommended)

**Technical Details:**
```typescript
interface ActiveSession {
  userId: string;
  username: string;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

**Middleware:**
- `trackActivity`: Updates session activity on each request
- `getActiveSessions()`: Returns users active in last 5 minutes
- `removeSession(userId)`: Clears session on logout

---

### 2. **Admin Dashboard** 📊
Comprehensive overview of platform health and user activity.

**Endpoint:** `GET /api/admin/dashboard`

**Returns:**
```json
{
  "overview": {
    "totalUsers": 150,
    "newUsersToday": 8,
    "newUsersThisWeek": 42,
    "totalBoards": 85,
    "activeBoards": 67,
    "totalTasks": 523,
    "completionRate": "68.45"
  },
  "activeSessions": [
    {
      "userId": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "loginTime": "2024-01-15T10:30:00Z",
      "lastActivity": "2024-01-15T14:25:00Z",
      "duration": "3h 55m",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "taskAnalytics": {
    "byStatus": {
      "pending": 120,
      "in-progress": 165,
      "completed": 238
    },
    "byPriority": {
      "low": 95,
      "medium": 280,
      "high": 148
    }
  },
  "userAnalytics": {
    "byRole": {
      "admin": 3,
      "member": 147
    },
    "mostActive": [
      {
        "_id": "...",
        "name": "Sarah Johnson",
        "email": "sarah@example.com",
        "taskCount": 45
      }
    ]
  }
}
```

---

### 3. **User Management** 👥
View all users with detailed statistics and manage their roles.

**Endpoint:** `GET /api/admin/users`

**Returns:**
```json
{
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "createdAt": "2024-01-10T08:00:00Z",
      "stats": {
        "totalTasks": 28,
        "completedTasks": 19,
        "activeBoards": 5,
        "completionRate": "67.86"
      }
    }
  ],
  "total": 150
}
```

---

### 4. **Role Management** 🔐
Promote or demote users between admin and member roles.

**Endpoint:** `PUT /api/admin/users/:id/role`

**Request Body:**
```json
{
  "role": "admin"  // or "member"
}
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### 5. **Activity Timeline** 📅
View recent platform activity across boards, tasks, and users.

**Endpoint:** `GET /api/admin/activity`

**Returns:**
```json
{
  "activities": [
    {
      "type": "board",
      "action": "created",
      "timestamp": "2024-01-15T14:20:00Z",
      "user": "...",
      "details": {
        "boardName": "Q1 Sprint Board",
        "teamSize": 8
      }
    },
    {
      "type": "task",
      "action": "completed",
      "timestamp": "2024-01-15T14:15:00Z",
      "user": "...",
      "details": {
        "taskTitle": "Design homepage",
        "status": "completed",
        "priority": "high"
      }
    },
    {
      "type": "user",
      "action": "registered",
      "timestamp": "2024-01-15T13:45:00Z",
      "user": "...",
      "details": {
        "userName": "Alice Smith",
        "role": "member"
      }
    }
  ],
  "total": 30
}
```

**Activity Types:**
- Board: created, updated
- Task: created, updated
- User: registered

---

### 6. **Platform Growth Analytics** 📈
30-day growth metrics with daily breakdown.

**Endpoint:** `GET /api/admin/stats/platform`

**Returns:**
```json
{
  "stats": {
    "period": "30 days",
    "userGrowth": {
      "total": 150,
      "new": 45,
      "percentageIncrease": "42.86",
      "daily": [
        { "date": "2024-01-01", "count": 3 },
        { "date": "2024-01-02", "count": 5 },
        ...
      ]
    },
    "taskGrowth": {
      "total": 523,
      "new": 128,
      "percentageIncrease": "32.40",
      "daily": [...]
    },
    "boardGrowth": {
      "total": 85,
      "new": 22,
      "percentageIncrease": "34.92",
      "daily": [...]
    }
  }
}
```

---

### 7. **User Deletion (Cascade)** 🗑️
Delete users with automatic cleanup of related data.

**Endpoint:** `DELETE /api/admin/users/:id`

**Features:**
- Prevents admin from deleting themselves
- Cascade deletes all user's tasks
- Removes user from all board team members
- Maintains data integrity

**Response:**
```json
{
  "message": "User and all associated data deleted successfully"
}
```

---

## Authentication & Authorization

### Admin Middleware
```typescript
// Check if user has admin role
export const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin privileges required' 
    });
  }
  next();
};
```

### Protected Routes
All admin routes require:
1. **JWT Authentication** (`protect` middleware)
2. **Admin Role** (`adminOnly` middleware)
3. **Activity Tracking** (`trackActivity` middleware)

**Example Route Chain:**
```typescript
router.get('/dashboard', 
  protect,        // Verify JWT token
  adminOnly,      // Check admin role
  trackActivity,  // Track this request
  getDashboardStats
);
```

---

## API Routes Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get comprehensive dashboard stats |
| GET | `/api/admin/stats/platform` | Get 30-day growth metrics |
| GET | `/api/admin/activity` | Get recent activity timeline |
| GET | `/api/admin/users` | Get all users with stats |
| PUT | `/api/admin/users/:id/role` | Update user role |
| DELETE | `/api/admin/users/:id` | Delete user (cascade) |

---

## Usage Examples

### 1. View Dashboard (with active sessions)
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:5000/api/admin/dashboard
```

### 2. View All Users
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:5000/api/admin/users
```

### 3. Promote User to Admin
```bash
curl -X PUT \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' \
  http://localhost:5000/api/admin/users/USER_ID/role
```

### 4. View Platform Growth
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:5000/api/admin/stats/platform
```

### 5. View Activity Log
```bash
curl -H "Authorization: Bearer <admin_token>" \
  http://localhost:5000/api/admin/activity
```

### 6. Delete User
```bash
curl -X DELETE \
  -H "Authorization: Bearer <admin_token>" \
  http://localhost:5000/api/admin/users/USER_ID
```

---

## Security Considerations

### Session Tracking
- **Current**: In-memory Map (development)
- **Production**: Use Redis for distributed session storage
- **Auto-Cleanup**: Sessions expire after 5 minutes of inactivity
- **Privacy**: IP and User-Agent tracking (GDPR compliance required)

### Role Management
- Only existing admins can promote/demote users
- Self-demotion prevented in role update logic
- Self-deletion prevented in user deletion logic

### Rate Limiting
- **Recommended**: Add rate limiting to admin endpoints
- **Suggested Limits**: 
  - Dashboard: 100 requests/hour
  - User Management: 50 requests/hour
  - Deletions: 10 requests/hour

---

## Frontend Integration

### Admin Dashboard Component (To Be Implemented)
```typescript
// Suggested structure
interface AdminDashboard {
  // Real-time session monitor
  ActiveSessions: React.FC;
  
  // Overview cards
  StatsOverview: React.FC;
  
  // Charts
  TaskAnalyticsChart: React.FC;
  GrowthChart: React.FC;
  
  // User management
  UserTable: React.FC;
  RoleManager: React.FC;
  
  // Activity feed
  ActivityTimeline: React.FC;
}
```

### API Client Example
```typescript
// src/api/admin.ts
export const adminAPI = {
  getDashboard: () => 
    api.get('/admin/dashboard'),
  
  getUsers: () => 
    api.get('/admin/users'),
  
  updateUserRole: (userId: string, role: 'admin' | 'member') =>
    api.put(`/admin/users/${userId}/role`, { role }),
  
  deleteUser: (userId: string) =>
    api.delete(`/admin/users/${userId}`),
  
  getActivity: () =>
    api.get('/admin/activity'),
  
  getPlatformStats: () =>
    api.get('/admin/stats/platform')
};
```

---

## Testing

### Test Admin User
Create a test admin user:
```typescript
// In MongoDB or via seed script
{
  name: "Admin User",
  email: "admin@hackathonhelper.com",
  password: "<hashed_password>",
  role: "admin"
}
```

### Test Scenarios
1. ✅ Admin can access all admin endpoints
2. ✅ Regular users get 403 Forbidden
3. ✅ Session tracking updates on each request
4. ✅ Inactive sessions expire correctly
5. ✅ User deletion cascades properly
6. ✅ Role updates work correctly
7. ✅ Dashboard shows accurate stats
8. ✅ Activity log shows recent actions
9. ✅ Growth charts show 30-day data

---

## Performance Optimization

### Database Queries
- Use MongoDB aggregation for analytics
- Index on `createdAt`, `updatedAt` for activity queries
- Populate only necessary fields

### Caching Strategy
```typescript
// Recommended: Cache dashboard stats for 5 minutes
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Use Redis or in-memory cache
cache.set('admin:dashboard', stats, CACHE_TTL);
```

### Session Storage
```typescript
// Production: Use Redis
import Redis from 'ioredis';
const redis = new Redis();

// Store sessions
await redis.setex(
  `session:${userId}`, 
  300, // 5 min TTL
  JSON.stringify(session)
);
```

---

## Future Enhancements

### Planned Features
- [ ] Real-time WebSocket updates for dashboard
- [ ] Email notifications for important events
- [ ] Advanced analytics (user retention, churn rate)
- [ ] Export data to CSV/Excel
- [ ] Audit log with complete history
- [ ] Custom date range for analytics
- [ ] User activity heatmaps
- [ ] Team productivity reports
- [ ] Automated admin reports (daily/weekly)
- [ ] Two-factor authentication for admins

### Technical Improvements
- [ ] Move session tracking to Redis
- [ ] Add comprehensive logging
- [ ] Implement rate limiting
- [ ] Add request caching
- [ ] Database query optimization
- [ ] Add more granular permissions
- [ ] Implement soft deletes
- [ ] Add data backup/restore

---

## Troubleshooting

### Common Issues

**1. 403 Forbidden on admin routes**
- Ensure user has `role: "admin"` in database
- Check JWT token is valid and not expired
- Verify `Authorization` header is properly set

**2. Session tracking not working**
- Ensure `trackActivity` middleware is applied
- Check that `protect` middleware runs before `trackActivity`
- Verify session Map is properly initialized

**3. Activity log empty**
- Check date filtering logic
- Ensure boards/tasks have `createdAt`/`updatedAt` fields
- Verify MongoDB timestamps are enabled in schemas

**4. Dashboard stats incorrect**
- Clear cache if using caching
- Check MongoDB aggregation queries
- Verify data exists in collections

---

## Files Modified/Created

### New Files
1. `backend/src/controllers/adminController.ts` - All admin logic
2. `backend/src/routes/admin.ts` - Admin API routes
3. `backend/ADMIN_FEATURES.md` - This documentation

### Modified Files
1. `backend/src/middleware/auth.ts` - Added session tracking & admin middleware
2. `backend/src/app.ts` - Registered admin routes

---

## Credits
**Feature Requested By:** User (Creative admin privileges with session tracking)  
**Implemented By:** GitHub Copilot  
**Date:** January 2024  
**Version:** 1.0.0

---

## Support
For issues or questions about admin features:
1. Check this documentation first
2. Review error logs in console
3. Test with Postman/curl to isolate issues
4. Check MongoDB data integrity
5. Verify JWT token and user role

---

**Happy Administrating! 🚀**
