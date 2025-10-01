# MongoDB Atlas Setup Guide

## 🎯 Quick Setup (5-10 minutes)

### Step 1: Install MongoDB for VS Code Extension
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for **"MongoDB for VS Code"**
3. Click **Install**

### Step 2: Get Your Connection String from the Screenshot

Based on your MongoDB Atlas setup, your connection string is:
```
mongodb+srv://saransh623252424_db_user:<db_password>@hackathon-helper.olmqd5.mongodb.net/
```

**Replace `<db_password>` with your actual database password!**

### Step 3: Test Connection in VS Code

1. Open **Command Palette** (Ctrl+Shift+P)
2. Type **"MongoDB: Connect with Connection String"**
3. Paste your connection string (with password)
4. Click **"Create New Playground"** to test

### Step 4: Update Backend Environment Variables

#### For Local Testing with Atlas:
Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://saransh623252424_db_user:YOUR_PASSWORD@hackathon-helper.olmqd5.mongodb.net/hackathon-helper?retryWrites=true&w=majority
```

#### For Production (Render):
Use `backend/.env.production` (already created) and update when deploying.

### Step 5: Restart Your Backend Server

After updating the connection string:
```bash
cd backend
npm run dev
```

You should see:
```
🍃 MongoDB Connected: hackathon-helper.olmqd5.mongodb.net
```

## 🔐 Security Notes

1. **Never commit passwords** - `.env` is in `.gitignore`
2. **URL encode special characters** in password
3. **Whitelist your IP** in MongoDB Atlas Network Access
4. **Use environment variables** for production on Render

## 📚 Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Database Access Settings](https://cloud.mongodb.com/v2#/org/YOUR_ORG/access/database)
- [Network Access (IP Whitelist)](https://cloud.mongodb.com/v2#/org/YOUR_ORG/access/network)

## ✅ Verification Checklist

- [ ] MongoDB for VS Code extension installed
- [ ] Connection string obtained from Atlas
- [ ] Password replaced in connection string
- [ ] IP address whitelisted (0.0.0.0/0 for anywhere, or specific IP)
- [ ] Backend .env updated with Atlas connection string
- [ ] Backend restarted successfully
- [ ] Connection confirmed: "MongoDB Connected: hackathon-helper.olmqd5.mongodb.net"

## 🚨 Troubleshooting

### Error: "Authentication failed"
- Check that your password is correct
- URL encode special characters in password (e.g., @ becomes %40)

### Error: "Connection timeout"
- Whitelist your IP address in MongoDB Atlas Network Access
- Or use 0.0.0.0/0 to allow from anywhere (less secure but works everywhere)

### Error: "Database not found"
- MongoDB will create the database automatically on first write
- Use `/hackathon-helper` at the end of connection string

## 🎉 Next Steps

Once connected to MongoDB Atlas:
1. Your data will be stored in the cloud
2. You can deploy to Render without changing database config
3. Access your data from anywhere
4. Use MongoDB Compass or VS Code extension to view data

---

**Your Connection String Format:**
```
mongodb+srv://saransh623252424_db_user:YOUR_ACTUAL_PASSWORD@hackathon-helper.olmqd5.mongodb.net/hackathon-helper?retryWrites=true&w=majority
```

Replace `YOUR_ACTUAL_PASSWORD` with the password for user `saransh623252424_db_user`.
