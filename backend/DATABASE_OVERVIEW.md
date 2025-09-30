# 🗄️ Database Overview - Hackathon Helper

## 📊 Current Database Status

### Connection Details:
- **Database**: hackathon-helper
- **Collections**: 3 (users, tasks, boards)
- **Total Documents**: 2
- **Data Size**: 0.44 KB
- **Index Size**: 100.00 KB

---

## 👥 Users Collection (2 users)

### 1. Admin User
```json
{
  "id": "68dbe2046be52a18c3a85f75",
  "name": "Admin User",
  "email": "admin@hackathon.com",
  "role": "admin",
  "password": "[bcrypt encrypted]",
  "created": "2025-09-30T13:58:28.000Z"
}
```

### 2. Test User  
```json
{
  "id": "68dbe0c81129ab76f805195a", 
  "name": "Test User",
  "email": "test@example.com",
  "role": "member",
  "password": "[bcrypt encrypted]",
  "created": "2025-09-30T13:53:12.000Z"
}
```

---

## 📝 Tasks Collection
**Status**: Empty (0 documents)
- Ready to store task data
- Schema supports: title, description, status, priority, assignee, board, etc.

## 📋 Boards Collection  
**Status**: Empty (0 documents)
- Ready to store board data
- Schema supports: name, description, owner, members, columns, etc.

---

## 🔑 Login Credentials

### Admin Access:
```
Email: admin@hackathon.com
Password: admin123
Role: admin
```

### Regular User Access:
```
Email: test@example.com  
Password: test123
Role: member
```

---

## 🌐 Access Points

### Frontend (React App):
```
http://localhost:5173/
http://localhost:5173/login
```

### Backend API:
```
http://localhost:5000/
http://localhost:5000/api/auth/login
http://localhost:5000/api/admin/dashboard
```

### Admin Login Page (HTML):
```
file:///c:/Users/udayj/hackathonpractice/backend/admin-login.html
```

---

## 🛠️ Database Operations Available

### View Database:
```bash
node backend/viewDatabase.js
node backend/detailedDatabaseViewer.js
```

### Create Admin User:
```bash
node backend/createAdmin.js
```

### Database Queries:
```bash
node backend/database_queries.js
```

---

## 📈 What You Can Do Now

### 1. **Login as Admin**
- Open admin-login.html
- Use admin@hackathon.com / admin123
- Access admin dashboard

### 2. **Login as Regular User**  
- Open http://localhost:5173/login
- Use test@example.com / test123
- Access Kanban board

### 3. **Create Tasks & Boards**
- Login to frontend
- Create new boards
- Add tasks to boards
- Move tasks between columns

### 4. **View Analytics**
- Login as admin
- View task analytics
- See board statistics
- Check user metrics

### 5. **Manage Users**
- Admin can view all users
- Update user roles
- Delete users
- See user statistics

---

## 🔄 Database Will Grow As You Use The App

Currently empty collections will populate when you:
- Create your first board → boards collection
- Add your first task → tasks collection  
- Register new users → users collection

---

## 📊 Real-Time Monitoring

View database changes in real-time:
```bash
# Terminal 1: Start backend
npm run dev --prefix backend

# Terminal 2: Monitor database  
node backend/viewDatabase.js

# Terminal 3: Start frontend
npm run dev
```

---

## 🎯 Next Steps

1. **Start Creating Content**:
   - Login to frontend
   - Create boards and tasks
   - Watch database populate

2. **Test Admin Features**:
   - Login as admin
   - View analytics
   - Manage users

3. **Monitor Growth**:
   - Run viewDatabase.js periodically
   - See new data appear
   - Track user activity

Your database is ready and functional! 🚀