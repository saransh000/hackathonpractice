# 🚀 Quick Deployment Reference

## Your MongoDB Atlas Connection String
```
mongodb+srv://saransh6232524224_db_user:r6KUpOtE7iNwDZNP@hackathon-helper.omlmqd5.mongodb.net/hackathon-helper?retryWrites=true&w=majority&appName=hackathon-helper
```

---

## Backend Configuration (Render Web Service)

**Service Name:** `hackathon-helper-backend`

**Settings:**
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Instance Type: Free

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://saransh6232524224_db_user:r6KUpOtE7iNwDZNP@hackathon-helper.omlmqd5.mongodb.net/hackathon-helper?retryWrites=true&w=majority&appName=hackathon-helper
JWT_SECRET=hackathon-super-secret-jwt-key-2025-production-CHANGE-THIS
JWT_EXPIRE=7d
CORS_ORIGIN=https://hackathon-helper-frontend.onrender.com
```

---

## Frontend Configuration (Render Static Site)

**Service Name:** `hackathon-helper-frontend`

**Settings:**
- Root Directory: `/` (or leave empty)
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

**Environment Variable:**
```
VITE_API_URL=https://hackathon-helper-backend.onrender.com
```
(Replace with YOUR actual backend URL after backend is deployed)

---

## Login Credentials (After Deployment)

**Admin:**
- Email: admin@hackathon.com
- Password: admin123

**User:**
- Email: uday@gmail.com
- Password: user123

---

## Deployment Checklist

- [ ] Sign up at render.com with GitHub
- [ ] Deploy backend web service
- [ ] Copy backend URL
- [ ] Update .env.production with backend URL
- [ ] Commit and push changes
- [ ] Deploy frontend static site
- [ ] Copy frontend URL
- [ ] Update backend CORS_ORIGIN with frontend URL
- [ ] Test the app!

---

## Expected URLs

After deployment:
- Frontend: `https://hackathon-helper-frontend.onrender.com`
- Backend: `https://hackathon-helper-backend.onrender.com`
- Health Check: `https://hackathon-helper-backend.onrender.com/health`

---

## Important Notes

1. **First deploy takes 5-10 minutes** for each service
2. **Free tier sleeps after 15 min inactivity** - wake up by visiting site
3. **Auto-deploy enabled** - push to GitHub triggers redeploy
4. **CORS must match exactly** - no trailing slashes!

---

## Common Issues & Fixes

**"Failed to fetch"**
→ Check CORS_ORIGIN matches frontend URL exactly

**Backend not starting**
→ Check MongoDB connection string in environment variables

**Frontend blank page**
→ Verify VITE_API_URL is set in frontend environment

**Slow first load**
→ Normal! Free tier wakes up from sleep (30 seconds)

---

## Quick Links

- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- Your GitHub Repo: https://github.com/saransh000/hackathonpractice
- Render Docs: https://render.com/docs
