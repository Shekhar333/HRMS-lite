# Deployment Guide - HRMS Lite

Complete step-by-step deployment guide for production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Render account (free)
- Vercel account (free)

---

## Part 1: MongoDB Atlas Setup

### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose free tier (M0)

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "M0 Free" tier
3. Select region closest to your users
4. Click "Create Cluster"

### Step 3: Create Database User
1. Security → Database Access → Add New Database User
2. Authentication Method: Password
3. Username: `hrmsadmin` (or your choice)
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Security → Network Access → Add IP Address
2. Click "Allow Access from Anywhere"
3. IP Address: `0.0.0.0/0`
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Python, Version: 3.12 or later
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Save this for later!

Example: `mongodb+srv://hrmsadmin:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## Part 2: Deploy Backend on Render

### Step 1: Push to GitHub
```bash
cd HRMS-Lite
git init
git add .
git commit -m "Initial commit - HRMS Lite"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access repositories

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Find and select your HRMS-Lite repository
4. Click "Connect"

### Step 4: Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `hrms-lite-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Step 5: Add Environment Variables
Click "Advanced" → Add Environment Variables:

```
MONGODB_URL = mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME = hrms_lite
CORS_ORIGINS = http://localhost:5173
```

(We'll update CORS_ORIGINS after deploying frontend)

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait for build (5-10 minutes)
3. Once deployed, copy your backend URL
   - Example: `https://hrms-lite-backend.onrender.com`
4. Test it: Visit `https://your-url.onrender.com/docs`

### Step 7: Keep Backend Active (Optional)
Render free tier sleeps after 15 minutes of inactivity.

Options:
1. Use a service like UptimeRobot to ping your backend every 14 minutes
2. Upgrade to paid plan ($7/month)
3. Accept the 30-second cold start on first request

---

## Part 3: Deploy Frontend on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Click "Import"

### Step 3: Configure Project
**Framework Preset**: Vite
**Root Directory**: `frontend`
**Build Command**: `npm run build` (auto-detected)
**Output Directory**: `dist` (auto-detected)
**Install Command**: `npm install` (auto-detected)

### Step 4: Add Environment Variable
1. Click "Environment Variables"
2. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (from Step 2)
   - **Environment**: All (Production, Preview, Development)
3. Click "Add"

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Once deployed, copy your frontend URL
   - Example: `https://hrms-lite.vercel.app`

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
   ```
5. Save changes (Render will auto-redeploy)

---

## Part 4: Verify Deployment

### Backend Verification
1. Visit `https://your-backend.onrender.com`
   - Should show: `{"message":"HRMS Lite API","status":"running"}`

2. Visit `https://your-backend.onrender.com/docs`
   - Should show Swagger UI with all endpoints

3. Test an endpoint:
   - Click "GET /api/employees" → "Try it out" → "Execute"
   - Should return `[]` (empty array)

### Frontend Verification
1. Visit `https://your-app.vercel.app`
   - Should load the application

2. Test Employee Management:
   - Add a new employee
   - Verify it appears in the list
   - Try adding duplicate (should fail)
   - Delete the employee

3. Test Attendance Management:
   - Add an employee first
   - Mark attendance
   - Verify it appears in attendance records
   - Try filtering by date

### Full Integration Test
1. Open browser DevTools → Network tab
2. Add an employee
3. Check network calls go to your Render backend
4. Verify no CORS errors
5. Test all features end-to-end

---

## Part 5: Post-Deployment

### Update README
Update your README.md with live URLs:

```markdown
## 🚀 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.onrender.com
- **GitHub**: https://github.com/yourusername/HRMS-Lite
```

Commit and push:
```bash
git add README.md
git commit -m "Update README with live URLs"
git push
```

### Set Up Custom Domain (Optional)
**Vercel:**
1. Project Settings → Domains
2. Add your domain
3. Follow DNS configuration steps

**Render:**
1. Service Settings → Custom Domain
2. Add your domain
3. Configure DNS records

---

## Troubleshooting

### Backend Issues

**Build fails:**
- Check Python version (should be 3.8+)
- Verify requirements.txt exists
- Check build logs for specific errors

**MongoDB connection fails:**
- Verify connection string is correct
- Check IP whitelist (0.0.0.0/0)
- Verify database user credentials

**Service keeps restarting:**
- Check environment variables
- Look at logs for errors
- Verify start command is correct

### Frontend Issues

**Build fails:**
- Check Node version compatibility
- Verify package.json is valid
- Check build logs

**API calls fail:**
- Verify VITE_API_URL is correct
- Check backend CORS_ORIGINS includes frontend URL
- Look at browser console for errors

**Blank page:**
- Check browser console for errors
- Verify build completed successfully
- Check Vercel function logs

### CORS Issues
If you see CORS errors:

1. Verify backend CORS_ORIGINS includes frontend URL (with https://)
2. No trailing slash in URLs
3. Redeploy backend after changing CORS settings
4. Clear browser cache

---

## Monitoring & Maintenance

### Render Dashboard
- Monitor CPU/Memory usage
- Check deploy history
- View logs in real-time

### Vercel Dashboard
- Monitor bandwidth usage
- Check build times
- View function logs

### MongoDB Atlas
- Monitor database size
- Check connection counts
- Review performance metrics

---

## Cost Breakdown

**Free Tier Limits:**

✅ **MongoDB Atlas M0**: 512MB storage (free forever)
✅ **Render Free**: 750 hours/month (enough for 1 service)
✅ **Vercel Hobby**: 100GB bandwidth/month

**This application should run completely free!**

---

## Next Steps

1. ✅ Share your live URLs
2. ✅ Add custom domain (optional)
3. ✅ Set up monitoring (UptimeRobot, etc.)
4. ✅ Enable Google Analytics (optional)
5. ✅ Add error tracking (Sentry, etc.)

---

## Support

If you encounter issues:

1. Check Render/Vercel logs
2. Review MongoDB Atlas metrics
3. Test endpoints in Swagger UI
4. Check browser console errors

---

**Congratulations! Your HRMS Lite application is now live! 🎉**
