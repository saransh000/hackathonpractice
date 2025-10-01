# 🚀 Deployment Guide - Hackathon Helper

## Production Deployment to Render.com

This guide will help you deploy your Hackathon Helper application to Render.com for free.

---

## ✅ Phase 1: Code Preparation (COMPLETED)

The following changes have been made to prepare your code for production:

### Frontend Changes:
- ✅ Created `.env.production` file with production API URL configuration
- ✅ Created `.env.development` file for local development
- ✅ Created `src/config/api.ts` for centralized API configuration
- ✅ Updated `AuthContext.tsx` to use environment variables
- ✅ Updated `MessagingPanel.tsx` to use environment variables
- ✅ Updated `LoginHistoryPage.tsx` to use environment variables
- ✅ Updated `DatabaseViewerPage.tsx` to use environment variables

### Backend Changes:
- ✅ Already has proper `build` and `start` scripts in `package.json`
- ✅ Server configured to bind to `0.0.0.0` for production
- ✅ Environment variables properly configured

---

## 📝 Next Steps: Manual Deployment

### Step 1: Create MongoDB Atlas Database (15 minutes)

1. **Sign up at MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and sign up with Google/GitHub

2. **Create a Free Cluster:**
   - Choose **"Shared"** (FREE M0 tier)
   - Select **AWS** provider
   - Choose region closest to you
   - Name: `hackathon-helper`
   - Click "Create Cluster" (takes 3-5 min)

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `hackathon-admin`
   - **COPY AND SAVE PASSWORD SOMEWHERE SAFE!**
   - Set role to "Atlas Admin"
   - Click "Add User"

4. **Allow Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add database name before `?`:
   ```
   mongodb+srv://hackathon-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hackathon-helper?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend to Render (10 minutes)

1. **Sign up at Render:**
   - Go to: https://render.com
   - Click "Get Started"
   - Sign up with GitHub (easiest for auto-deploy)
   - Authorize Render to access `saransh000/hackathonpractice`

2. **Create Backend Web Service:**
   - Click "New +" → "Web Service"
   - Select your repository: `saransh000/hackathonpractice`
   - Configure:
     - **Name:** `hackathon-helper-backend`
     - **Region:** US East (or closest to you)
     - **Branch:** `main`
     - **Root Directory:** `backend`
     - **Runtime:** `Node`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`
     - **Instance Type:** `Free`

3. **Add Environment Variables:**
   Click "Advanced" and add these:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
   JWT_SECRET=hackathon-super-secret-jwt-key-2025-production-32chars
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-will-go-here.onrender.com
   ```

   **Important:** 
   - Replace `MONGODB_URI` with your MongoDB Atlas connection string
   - We'll update `CORS_ORIGIN` after frontend deployment

4. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://hackathon-helper-backend.onrender.com`
   - **COPY THIS URL** - you need it for frontend!

5. **Test Backend:**
   - Visit: `https://hackathon-helper-backend.onrender.com/health`
   - Should see: `{"success":true,"message":"Hackathon Helper API is running!",...}`

---

### Step 3: Deploy Frontend to Render (10 minutes)

1. **Update .env.production file:**
   Before deploying, update `.env.production` with your backend URL:
   ```bash
   VITE_API_URL=https://hackathon-helper-backend.onrender.com
   ```

2. **Commit and push changes:**
   ```bash
   git add .env.production
   git commit -m "Update production API URL"
   git push origin main
   ```

3. **Create Static Site on Render:**
   - Click "New +" → "Static Site"
   - Select your repository: `saransh000/hackathonpractice`
   - Configure:
     - **Name:** `hackathon-helper-frontend`
     - **Branch:** `main`
     - **Root Directory:** `/` (leave empty or just slash)
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   Click "Advanced" and add:
   ```
   VITE_API_URL=https://hackathon-helper-backend.onrender.com
   ```
   (Use your actual backend URL from Step 2.4)

5. **Deploy:**
   - Click "Create Static Site"
   - Wait 5-10 minutes
   - You'll get a URL like: `https://hackathon-helper-frontend.onrender.com`

---

### Step 4: Update Backend CORS (5 minutes)

1. **Go back to your backend service on Render**
2. Go to "Environment" tab
3. **Update CORS_ORIGIN** to your frontend URL:
   ```
   CORS_ORIGIN=https://hackathon-helper-frontend.onrender.com
   ```
4. Click "Save Changes" (this will trigger a redeploy - takes 2-3 min)

---

### Step 5: Test Your Deployed Application

1. **Visit your frontend URL:**
   `https://hackathon-helper-frontend.onrender.com`

2. **Test Login:**
   - Email: `admin@hackathon.com`
   - Password: `admin123`

3. **Test Features:**
   - ✅ Kanban board
   - ✅ Add/edit tasks
   - ✅ Messaging system
   - ✅ Admin dashboard
   - ✅ Login history

---

## 🎯 Your Deployment URLs

After following the steps above, you'll have:

- **Frontend:** `https://hackathon-helper-frontend.onrender.com`
- **Backend:** `https://hackathon-helper-backend.onrender.com`
- **Database:** MongoDB Atlas (hidden, accessed via backend)

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Services **sleep after 15 minutes** of inactivity
- First request after sleep takes **~30 seconds** (cold start)
- Subsequent requests are fast
- **750 hours/month free** (enough for 24/7 operation of 1 service)

### To Prevent Cold Starts (Optional):
- Use a service like **UptimeRobot** (free) to ping your backend every 14 minutes
- Or upgrade to paid tier ($7/month) for always-on service

### Security:
- ✅ All connections use HTTPS (automatic SSL)
- ✅ CORS properly configured
- ✅ JWT authentication
- ✅ Rate limiting enabled
- ✅ Helmet security headers

---

## 🔧 Troubleshooting

### Issue: Backend not starting
**Solution:** Check logs on Render dashboard, verify MongoDB connection string

### Issue: CORS errors
**Solution:** Ensure CORS_ORIGIN exactly matches frontend URL (including https://)

### Issue: Frontend shows "Failed to fetch"
**Solution:** 
1. Check backend is running (visit /health endpoint)
2. Verify VITE_API_URL is set correctly
3. Check browser console for specific error

### Issue: Cold start is too slow
**Solution:** 
1. Use UptimeRobot to ping every 14 minutes
2. Or upgrade to paid tier

---

## 📊 Monitoring Your Deployment

### On Render Dashboard:
- View real-time logs
- Monitor CPU/Memory usage
- See deployment history
- Check service health

### Recommended:
- Set up **UptimeRobot** for uptime monitoring (free)
- Monitor MongoDB Atlas usage (Database → Metrics)

---

## 🎉 You're Done!

Your Hackathon Helper application is now live and accessible from anywhere in the world!

Share your URLs:
- **App:** `https://hackathon-helper-frontend.onrender.com`
- **API:** `https://hackathon-helper-backend.onrender.com/health`

---

## 💡 Tips for Demo/Hackathon

1. **Before Demo:**
   - Visit your site 1-2 minutes before to wake it up
   - Test all features work
   - Have login credentials ready

2. **During Demo:**
   - Mention it's deployed on free tier (impressive!)
   - Show the GitHub repo
   - Demonstrate all features

3. **For Judges:**
   - Mention: "Fully deployed and production-ready"
   - Show: "Works from any device with internet"
   - Highlight: "Secure authentication and real-time features"

---

## Need Help?

If you encounter issues:
1. Check Render logs (click "Logs" on your service)
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

Good luck with your hackathon! 🚀
