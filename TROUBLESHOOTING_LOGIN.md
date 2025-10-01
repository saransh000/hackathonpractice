# Troubleshooting "Failed to Fetch" Login Error

## 🔍 Problem
Friend gets "Failed to fetch" error when trying to login.

## ✅ Solutions

### Solution 1: If Friend is on the SAME Computer
**Issue**: Backend server not running

**Fix**:
1. Open terminal in `C:\Users\udayj\hackathonpractice\backend`
2. Run: `npm run dev`
3. Wait for: "🚀 Server is running on port 5000"
4. Tell friend to try logging in again

---

### Solution 2: If Friend is on DIFFERENT Computer (Network Access)

**Issue**: CORS blocking external connections

**Fix - Update CORS Settings**:

1. Open: `backend/src/app.ts`
2. Find line 23 (CORS configuration)
3. Change from:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));
```

To:
```typescript
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
}));
```

4. Restart backend server:
   - Press `Ctrl+C` in backend terminal
   - Run: `npm run dev`

**Get Your Computer's IP Address**:
1. Open terminal
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your network adapter
4. Example: `192.168.1.100`

**Share with Friend**:
- Frontend URL: `http://YOUR_IP:5173` (e.g., http://192.168.1.100:5173)
- Backend URL: `http://YOUR_IP:5000` (e.g., http://192.168.1.100:5000)

**Update Frontend API URL**:
1. Open: `src/api/http.ts`
2. Change:
```typescript
export const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

To:
```typescript
export const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://YOUR_IP:5000';
```

**Or Create .env file**:
Create `.env` in root directory:
```
VITE_API_BASE_URL=http://YOUR_IP:5000
```

---

### Solution 3: Rate Limit Exceeded

**Issue**: Too many login attempts

**Fix**:
1. Wait 15 minutes OR
2. Restart backend server (clears rate limits)

---

### Solution 4: Wrong API URL in Frontend

**Check AuthContext.tsx**:

Lines 40-50 should have:
```typescript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: credentials.email,
    password: credentials.password,
  }),
});
```

Make sure URL is correct!

---

## 🧪 Quick Test

**Test Backend is Running**:
Open in browser: `http://localhost:5000/health`

Should show:
```json
{
  "success": true,
  "message": "Hackathon Helper API is running!",
  "timestamp": "..."
}
```

**Test Frontend is Running**:
Open in browser: `http://localhost:5173`

Should show the login page.

---

## 🔐 Valid Login Credentials

Make sure using correct credentials:

**Admin**:
- Email: `admin@hackathon.com`
- Password: `admin123`

**Users**:
- Email: `uday@gmail.com`
- Password: `user123`

---

## 📞 Need More Help?

Check browser console (F12) for error details:
- Network tab shows failed requests
- Console tab shows JavaScript errors

---

## ✅ Final Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] CORS configured correctly
- [ ] Using correct credentials
- [ ] No rate limit errors
- [ ] Both servers accessible

---

**Last Updated**: October 1, 2025
