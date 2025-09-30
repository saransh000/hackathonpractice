# Admin Analytics API Documentation

## Overview
The Admin Analytics API provides comprehensive insights into your Hackathon Helper Tool's performance, user activity, and system health.

## Authentication
All analytics endpoints require:
1. Valid JWT token
2. Admin role (role: 'admin')

## Base URL
```
http://localhost:5000/api/admin/analytics
```

## Endpoints

### 1. Task Analytics
**GET** `/api/admin/analytics/tasks`

Provides comprehensive task performance metrics.

#### Response Example:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalTasks": 150,
      "completedTasks": 98,
      "pendingTasks": 52,
      "completionRate": 65.33
    },
    "byPriority": [
      { "_id": "high", "count": 30 },
      { "_id": "medium", "count": 70 },
      { "_id": "low", "count": 50 }
    ],
    "byStatus": [
      { "_id": "todo", "count": 30 },
      { "_id": "in-progress", "count": 22 },
      { "_id": "completed", "count": 98 }
    ],
    "recentActivity": [
      {
        "taskId": "...",
        "title": "Implement feature X",
        "status": "completed",
        "priority": "high",
        "updatedAt": "2025-09-30T14:30:00.000Z"
      }
    ],
    "productivity": {
      "avgCompletionTime": "3.5 days",
      "tasksCompletedToday": 12,
      "tasksCompletedThisWeek": 45
    }
  }
}
```

### 2. Board Analytics
**GET** `/api/admin/analytics/boards`

Provides board collaboration and activity metrics.

#### Response Example:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBoards": 15,
      "activeBoards": 12,
      "archivedBoards": 3
    },
    "boardActivity": [
      {
        "_id": "boardId123",
        "name": "Sprint Planning",
        "taskCount": 45,
        "memberCount": 8,
        "lastActivity": "2025-09-30T14:30:00.000Z",
        "completionRate": 75.5
      }
    ],
    "collaboration": {
      "avgMembersPerBoard": 5.2,
      "mostActiveBoard": {
        "name": "Sprint Planning",
        "taskCount": 45
      },
      "boardsCreatedThisMonth": 3
    }
  }
}
```

### 3. System Analytics
**GET** `/api/admin/analytics/system`

Provides system-wide health and performance metrics.

#### Response Example:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "active": 120,
      "newThisMonth": 15,
      "byRole": [
        { "_id": "admin", "count": 5 },
        { "_id": "member", "count": 145 }
      ]
    },
    "activity": {
      "tasksCreatedToday": 25,
      "tasksCompletedToday": 18,
      "boardsCreatedToday": 2,
      "activeUsersToday": 45
    },
    "growth": {
      "userGrowthRate": "+10% this month",
      "taskGrowthRate": "+25% this month",
      "engagementRate": "78%"
    },
    "systemHealth": {
      "status": "healthy",
      "uptime": "99.9%",
      "responseTime": "120ms"
    }
  }
}
```

## Testing with PowerShell

### Step 1: Login as Admin
```powershell
$loginBody = @{
    email = "admin@hackathon.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $response.token
```

### Step 2: Get Task Analytics
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$taskAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/tasks" -Method Get -Headers $headers
$taskAnalytics | ConvertTo-Json -Depth 10
```

### Step 3: Get Board Analytics
```powershell
$boardAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/boards" -Method Get -Headers $headers
$boardAnalytics | ConvertTo-Json -Depth 10
```

### Step 4: Get System Analytics
```powershell
$systemAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/system" -Method Get -Headers $headers
$systemAnalytics | ConvertTo-Json -Depth 10
```

## Features

### 🎯 Task Analytics
- **Total Overview**: Count of all tasks, completion status
- **Priority Distribution**: Tasks by priority (high, medium, low)
- **Status Tracking**: Tasks by status (todo, in-progress, completed)
- **Recent Activity**: Latest task updates
- **Productivity Metrics**: Completion time, daily/weekly stats

### 📊 Board Analytics
- **Board Overview**: Total, active, and archived boards
- **Board Activity**: Task counts, member counts, last activity
- **Collaboration Metrics**: Average members per board, most active boards
- **Growth Tracking**: New boards created this month

### 💻 System Analytics
- **User Metrics**: Total users, active users, new signups
- **Daily Activity**: Tasks created/completed, boards created
- **Growth Rates**: User growth, task growth, engagement rates
- **System Health**: Status, uptime, response time

## Rate Limiting

All analytics endpoints are protected by rate limiting:
- **Admin Rate Limit**: 50 requests per 10 minutes
- **General API Limit**: 100 requests per 15 minutes

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

## Integration Example

### Frontend React/TypeScript
```typescript
import axios from 'axios';

const getTaskAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'http://localhost:5000/api/admin/analytics/tasks',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching task analytics:', error);
    throw error;
  }
};
```

## Best Practices

1. **Caching**: Cache analytics data on the frontend for 5-10 minutes
2. **Error Handling**: Always handle 401/403 errors and redirect to login
3. **Loading States**: Show loading indicators while fetching analytics
4. **Refresh**: Provide manual refresh button for real-time updates
5. **Visualization**: Use charts (Chart.js, Recharts) to display data

## Next Steps

1. **Frontend Dashboard**: Create admin dashboard component
2. **Real-time Updates**: Add WebSocket support for live analytics
3. **Export Feature**: Add CSV/PDF export for reports
4. **Custom Date Ranges**: Filter analytics by date ranges
5. **Alerts**: Set up alerts for important metrics
