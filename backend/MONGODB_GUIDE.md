# MongoDB Installation & Database Viewing Guide

## 🔧 Install MongoDB Community Server

### Option 1: Download from MongoDB.com
1. Go to: https://www.mongodb.com/try/download/community
2. Select Windows
3. Download MSI installer
4. Run installer with default settings
5. Make sure to install MongoDB Compass (GUI tool)

### Option 2: Using Chocolatey (if you have it)
```powershell
choco install mongodb
```

### Option 3: Using Winget
```powershell
winget install MongoDB.Server
```

## 🚀 Start MongoDB

### Method 1: As Windows Service
```powershell
# Start service
net start MongoDB

# Stop service  
net stop MongoDB
```

### Method 2: Manual Start
```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

## 📊 View Database Content

### Method 1: MongoDB Compass (GUI - Recommended)
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Browse databases and collections visually
4. View documents in a user-friendly interface

### Method 2: MongoDB Shell
```powershell
# Connect to MongoDB
"C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe"

# Or if in PATH
mongosh

# Inside MongoDB shell:
use hackathon-helper
db.users.find().pretty()
```

### Method 3: VS Code Extension
1. Install "MongoDB for VS Code" extension
2. Connect to mongodb://localhost:27017
3. Browse collections in VS Code sidebar

## 🔍 Common Database Queries

```javascript
// Switch to your database
use hackathon-helper

// View all users (without passwords)
db.users.find({}, {password: 0}).pretty()

// Count users
db.users.countDocuments()

// Find user by email
db.users.findOne({"email": "john@example.com"}, {password: 0})

// Find recent users
db.users.find().sort({createdAt: -1}).limit(5)

// View all collections
show collections

// View database stats
db.stats()
```

## 🔧 Backend Environment Setup

Create/update `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackathon-helper
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## 📋 Test the Full Flow

1. Start MongoDB
2. Start backend: `npm run dev` (in backend folder)
3. Start frontend: `npm run dev` (in root folder)  
4. Register a new user at http://localhost:5173
5. Check MongoDB for the new user data

## 🎯 Expected User Document Structure

```json
{
  "_id": "ObjectId('...')",
  "name": "User Name",
  "email": "user@example.com", 
  "password": "$2a$10$hashed.password.here",
  "avatar": "",
  "role": "member",
  "createdAt": "2025-09-30T...",
  "updatedAt": "2025-09-30T...",
  "__v": 0
}
```