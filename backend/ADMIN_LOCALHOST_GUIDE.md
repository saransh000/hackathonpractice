# 🔐 Admin Side - Localhost Access Guide

## 🌐 Base URLs

### Backend API Server
**Main URL**: `http://localhost:5000`

Status: ✅ Running on Port 5000  
Database: ✅ MongoDB Connected

---

## 👤 Admin Credentials

```json
{
  "email": "admin@hackathon.com",
  "password": "admin123"
}
```

---

## 🔑 Step 1: Login to Get Admin Token

### Using Postman/Thunder Client:
```
POST http://localhost:5000/api/auth/login

Body (JSON):
{
  "email": "admin@hackathon.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@hackathon.com",
    "role": "admin"
  }
}
```

### Using PowerShell:
```powershell
$loginBody = @{
    email = "admin@hackathon.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $response.token

Write-Host "Token: $token"
```

### Using cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hackathon.com","password":"admin123"}'
```

---

## 📊 Admin Analytics Endpoints

### 1. Task Analytics
**Endpoint**: `GET http://localhost:5000/api/admin/analytics/tasks`

**Headers**:
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**What you get**:
- Total tasks count
- Completed vs pending tasks
- Completion rate percentage
- Tasks by priority (high, medium, low)
- Tasks by status (todo, in-progress, completed)
- Recent task activity
- Productivity metrics (avg completion time, daily/weekly stats)

**PowerShell**:
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$taskAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/tasks" -Method Get -Headers $headers
$taskAnalytics | ConvertTo-Json -Depth 10
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/admin/analytics/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 2. Board Analytics
**Endpoint**: `GET http://localhost:5000/api/admin/analytics/boards`

**What you get**:
- Total boards count
- Active vs archived boards
- Board activity (tasks per board, members per board)
- Collaboration metrics
- Most active boards
- Boards created this month

**PowerShell**:
```powershell
$boardAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/boards" -Method Get -Headers $headers
$boardAnalytics | ConvertTo-Json -Depth 10
```

---

### 3. System Analytics
**Endpoint**: `GET http://localhost:5000/api/admin/analytics/system`

**What you get**:
- Total users count
- Active users today
- New users this month
- User growth rate
- Tasks created/completed today
- Boards created today
- System health metrics
- Engagement rates

**PowerShell**:
```powershell
$systemAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/system" -Method Get -Headers $headers
$systemAnalytics | ConvertTo-Json -Depth 10
```

---

## 👥 Admin User Management Endpoints

### Get All Users
**Endpoint**: `GET http://localhost:5000/api/admin/users`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or email
- `role` - Filter by role (admin/member)

**Example**:
```
GET http://localhost:5000/api/admin/users?page=1&limit=10&role=member
```

---

### Get User Statistics
**Endpoint**: `GET http://localhost:5000/api/admin/users/stats`

**What you get**:
- Total users
- Users by role
- New users this month
- Active users today

---

### Get User by ID
**Endpoint**: `GET http://localhost:5000/api/admin/users/:id`

**Example**:
```
GET http://localhost:5000/api/admin/users/68dbe2046be52a18c3a85f75
```

---

### Update User Role
**Endpoint**: `PUT http://localhost:5000/api/admin/users/:id/role`

**Body**:
```json
{
  "role": "admin"
}
```

**Example**:
```
PUT http://localhost:5000/api/admin/users/68dbe0c81129ab76f805195a/role
```

---

### Delete User
**Endpoint**: `DELETE http://localhost:5000/api/admin/users/:id`

**Example**:
```
DELETE http://localhost:5000/api/admin/users/68dbe0c81129ab76f805195a
```

---

## 🧪 Complete Testing Flow (PowerShell)

Save this as a `.ps1` file and run it:

```powershell
# Step 1: Login
Write-Host "Logging in as admin..." -ForegroundColor Cyan

$loginBody = @{
    email = "admin@hackathon.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

Write-Host "Login successful!" -ForegroundColor Green
Write-Host "Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
Write-Host ""

# Step 2: Set headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 3: Get Task Analytics
Write-Host "Fetching Task Analytics..." -ForegroundColor Cyan
$taskAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/tasks" -Method Get -Headers $headers
Write-Host "Task Analytics:" -ForegroundColor Yellow
$taskAnalytics | ConvertTo-Json -Depth 10
Write-Host ""

# Step 4: Get Board Analytics
Write-Host "Fetching Board Analytics..." -ForegroundColor Cyan
$boardAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/boards" -Method Get -Headers $headers
Write-Host "Board Analytics:" -ForegroundColor Yellow
$boardAnalytics | ConvertTo-Json -Depth 10
Write-Host ""

# Step 5: Get System Analytics
Write-Host "Fetching System Analytics..." -ForegroundColor Cyan
$systemAnalytics = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/analytics/system" -Method Get -Headers $headers
Write-Host "System Analytics:" -ForegroundColor Yellow
$systemAnalytics | ConvertTo-Json -Depth 10
Write-Host ""

# Step 6: Get All Users
Write-Host "Fetching All Users..." -ForegroundColor Cyan
$users = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/users" -Method Get -Headers $headers
Write-Host "Users:" -ForegroundColor Yellow
$users | ConvertTo-Json -Depth 10
Write-Host ""

# Step 7: Get User Stats
Write-Host "Fetching User Statistics..." -ForegroundColor Cyan
$userStats = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/users/stats" -Method Get -Headers $headers
Write-Host "User Stats:" -ForegroundColor Yellow
$userStats | ConvertTo-Json -Depth 10

Write-Host ""
Write-Host "All admin endpoints tested successfully!" -ForegroundColor Green
```

---

## 🎯 Quick Access Links for Testing

### Using Browser-Based Tools (Postman, Thunder Client, Insomnia)

1. **Import Collection** (if using Postman):
   - Base URL: `http://localhost:5000`
   - Add all endpoints from this guide

2. **Set Environment Variables**:
   - `base_url`: `http://localhost:5000`
   - `admin_token`: (Get from login response)

### Direct Browser Access (Limited)

Some endpoints can be tested directly in browser:
- Login page: Create at `http://localhost:5173/login` (frontend)
- Once logged in, frontend can make API calls

---

## 🛡️ Security Features

All admin endpoints are protected by:

1. **JWT Authentication**: Valid token required
2. **Role Authorization**: Admin role required
3. **Rate Limiting**:
   - Admin endpoints: 50 requests per 10 minutes
   - Auth endpoints: 5 requests per 15 minutes
   - General API: 100 requests per 15 minutes

---

## 🔍 Testing with Database Viewer

View your database content:

```powershell
cd c:\Users\udayj\hackathonpractice\backend
node viewDatabase.js
```

This shows:
- All users in the database
- User roles and details
- Database statistics

---

## 📝 Response Examples

### Task Analytics Response
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
    ]
  }
}
```

---

## 🚀 Next Steps

1. **Create Admin Dashboard UI** in React
2. **Add Chart Visualizations** (Chart.js, Recharts)
3. **Set up Real-time Updates** (WebSockets)
4. **Export Reports** (CSV, PDF)
5. **Add Date Range Filters**

---

## 📞 Support

If you encounter issues:
1. Check backend server is running: `http://localhost:5000`
2. Verify MongoDB is connected
3. Ensure you're using admin credentials
4. Check token is included in headers

For detailed API documentation, see: `ADMIN_ANALYTICS_API.md`
