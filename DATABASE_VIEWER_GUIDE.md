# Database Viewer Guide

## 🎯 What Was Created

A beautiful **Database Viewer Page** that displays all users from your MongoDB database in a real-time table format.

## ✨ Features

### 📊 Statistics Dashboard
- **Total Users** - Count of all users
- **Admin Users** - Number of admins  
- **Member Users** - Number of regular members
- **Today's Signups** - New users registered today
- **This Week** - Signups in the last 7 days

### 📋 User Table
Displays comprehensive user information:
- **#** - Row number
- **Name** - User's full name with avatar
- **Email** - User's email address
- **Role** - Admin or Member badge
- **Joined** - Full signup date and time
- **Time Ago** - Relative time (e.g., "5m ago", "2h ago")
- **User ID** - MongoDB ObjectId

### 🔄 Refresh Button
- Real-time data refresh
- Loading spinner animation
- Last updated timestamp

## 🚀 How to Access

### From Kanban Board:
1. Login to the application at http://localhost:5173
2. Click the **"📊 View Database"** button at the top
3. View all database information

### From Database Viewer:
1. Click **"← Back to Kanban Board"** to return

## 🎨 Design Features

- **Glassmorphism** - Frosted glass effect backgrounds
- **Gradient Headers** - Blue to indigo gradient table header
- **Hover Effects** - Row highlights on hover
- **Responsive Design** - Works on all screen sizes
- **Dark Mode Support** - Automatic theme switching
- **Icons** - Lucide React icons throughout
- **Typography** - Poppins for headings, Inter for body

## 🔌 Backend Integration

Connects to your real backend API:
- **Endpoint**: `GET /api/admin/users`
- **Port**: http://localhost:5000
- **Authentication**: JWT token from localStorage
- **Database**: MongoDB real-time data

## 📝 What Changed

### New Files:
- `src/pages/DatabaseViewerPage.tsx` - Main database viewer component

### Modified Files:
- `src/App.tsx` - Added navigation between Kanban and Database pages
- `src/contexts/AuthContext.tsx` - Connected to real backend API (login & signup)

## ✅ Current Status

- **4 users** in database:
  1. hu (udattt@gmail.com) - Member
  2. New Test User (newuser@test.com) - Member
  3. Admin User (admin@hackathon.com) - Admin
  4. Test User (test@example.com) - Member

## 🎯 Next Steps

Try it out:
1. Make sure both servers are running:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173
2. Login to the app
3. Click "📊 View Database"
4. See your real MongoDB data in the table!

## 🔧 Troubleshooting

If data doesn't load:
- Check backend is running (`netstat -ano | findstr ":5000"`)
- Check you're logged in (token in localStorage)
- Click Refresh button
- Check browser console for errors (F12)

---

**All changes have been pushed to GitHub!** 🚀
