# 🔐 Admin Dashboard Access Guide

## The Problem
When you tried to access `http://localhost:5000/api/admin/dashboard` directly in the browser, you got:
```json
{"success":false,"error":"Not authorized to access this route"}
```

## Why This Happened
Admin endpoints require:
1. ✅ **Authentication** - You must be logged in (JWT token required)
2. ✅ **Authorization** - You must have `role: "admin"`

## ✅ Solution - How to Access Admin Dashboard

### Method 1: Use the Admin Login Page (EASIEST) 🎨

**I just created a login page for you!**

1. Open this file in your browser:
   ```
   C:\Users\saran\Desktop\bachchodi\hackathonpractice\backend\admin-login.html
   ```
   (It should have opened automatically)

2. **Login with these credentials:**
   - 📧 Email: `admin@hackathon.com`
   - 🔑 Password: `admin123`

3. **Click "Login & Get Token"**
   - You'll see your JWT token
   - Click "Copy Token" to copy it
   - Click the dashboard links to test the admin endpoints

---

### Method 2: Use Postman/Insomnia/Thunder Client 🔧

#### Step 1: Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@hackathon.com",
  "password": "admin123"
}
```

#### Step 2: Copy the Token
Response will look like:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@hackathon.com",
    "role": "admin"
  }
}
```

#### Step 3: Use Token to Access Admin Dashboard
```http
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

---

### Method 3: Use cURL (Command Line) 💻

#### Step 1: Login and Get Token
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@hackathon.com\",\"password\":\"admin123\"}'
```

#### Step 2: Access Dashboard with Token
```powershell
curl http://localhost:5000/api/admin/dashboard `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Method 4: Browser Extension (ModHeader) 🌐

1. Install **ModHeader** extension for Chrome/Edge
2. Login via the admin-login.html page
3. Copy the JWT token
4. In ModHeader, add:
   - Name: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`
5. Now you can visit `http://localhost:5000/api/admin/dashboard` directly in browser

---

## 👤 Available Users

### Admin User (Full Access)
- 📧 Email: `admin@hackathon.com`
- 🔑 Password: `admin123`
- 👤 Role: `admin`
- ✅ Can access ALL endpoints including admin dashboard

### Test User (Limited Access)
- 📧 Email: `user@test.com`
- 🔑 Password: `user123`
- 👤 Role: `member`
- ❌ Cannot access admin endpoints

---

## 📚 All Admin Endpoints

Once you have the JWT token, you can access:

### 1. Dashboard (Overview)
```http
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_TOKEN
```
**Returns:**
- Platform overview (users, boards, tasks, completion rate)
- Active sessions (who's online right now)
- Task analytics (by status and priority)
- User analytics (most active users)

### 2. All Users with Stats
```http
GET http://localhost:5000/api/admin/users
Authorization: Bearer YOUR_TOKEN
```
**Returns:**
- List of all users
- Each user's task count, completion rate, active boards

### 3. Activity Timeline
```http
GET http://localhost:5000/api/admin/activity
Authorization: Bearer YOUR_TOKEN
```
**Returns:**
- Recent 30 platform activities
- Boards created/updated, tasks created/updated, users registered

### 4. Platform Growth Stats
```http
GET http://localhost:5000/api/admin/stats/platform
Authorization: Bearer YOUR_TOKEN
```
**Returns:**
- 30-day growth metrics
- Daily breakdown for users, tasks, boards

### 5. Update User Role
```http
PUT http://localhost:5000/api/admin/users/:userId/role
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "role": "admin"  // or "member"
}
```

### 6. Delete User
```http
DELETE http://localhost:5000/api/admin/users/:userId
Authorization: Bearer YOUR_TOKEN
```

---

## 🎯 Quick Test

### Easiest Way:
1. ✅ Open `admin-login.html` (already opened for you)
2. ✅ Click "Login & Get Token" (credentials pre-filled)
3. ✅ Click "Dashboard" link to see admin data
4. ✅ Done! 🎉

---

## 🔒 Security Notes

### Why Token-Based Auth?
- **Stateless**: Server doesn't store session data
- **Secure**: Token is cryptographically signed
- **Scalable**: Works across multiple servers
- **Expires**: Token expires after 7 days (JWT_EXPIRE in .env)

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Don't Share Your Token!
- Anyone with your token can access your account
- Tokens should be kept secure
- In production, use HTTPS

---

## 🐛 Troubleshooting

### "Not authorized to access this route"
- ✅ Make sure you're logged in as admin user
- ✅ Check that you're sending the Authorization header
- ✅ Verify token format: `Bearer YOUR_TOKEN`

### "Token expired"
- ✅ Login again to get a new token
- ✅ Tokens expire after 7 days

### "Invalid token"
- ✅ Make sure you copied the entire token
- ✅ Check for extra spaces in the Authorization header

### "Email/password incorrect"
- ✅ Use: `admin@hackathon.com` / `admin123`
- ✅ Check if MongoDB is running
- ✅ Run the createAdmin.js script again if needed

---

## 📝 Example Response from Dashboard

```json
{
  "overview": {
    "totalUsers": 2,
    "newUsersToday": 0,
    "newUsersThisWeek": 2,
    "totalBoards": 0,
    "activeBoards": 0,
    "totalTasks": 0,
    "completionRate": "0.00"
  },
  "activeSessions": [
    {
      "userId": "66f...",
      "username": "Admin User",
      "email": "admin@hackathon.com",
      "loginTime": "2025-09-30T14:30:00.000Z",
      "lastActivity": "2025-09-30T14:35:00.000Z",
      "duration": "5m"
    }
  ],
  "taskAnalytics": {
    "byStatus": { "pending": 0, "in-progress": 0, "completed": 0 },
    "byPriority": { "low": 0, "medium": 0, "high": 0 }
  },
  "userAnalytics": {
    "byRole": { "admin": 1, "member": 1 },
    "mostActive": []
  }
}
```

---

## 🎉 You're All Set!

The admin-login.html page is open in your browser. Just click "Login & Get Token" and you'll have full access to the admin dashboard!

Happy administrating! 🚀
