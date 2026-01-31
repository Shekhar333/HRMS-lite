# Fix: Vercel Environment Variable Error

## Error Message
```
Environment Variable "VITE_API_URL" references Secret "vite_api_url", which does not exist.
```

## ✅ Solution

### Step 1: Fixed vercel.json
The `vercel.json` file has been updated to remove the secret reference.

**Changes made:**
- ❌ Removed: `"env": { "VITE_API_URL": "@vite_api_url" }`
- ✅ Environment variables will be set in Vercel Dashboard instead

### Step 2: Set Environment Variable in Vercel Dashboard

1. **Go to your Vercel project:**
   - https://vercel.com/dashboard
   - Select your HRMS-Lite project

2. **Navigate to Settings:**
   - Click "Settings" tab
   - Click "Environment Variables" in the sidebar

3. **Add the environment variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render backend URL
     ```
     https://your-backend.onrender.com
     ```
   - **Environments:** Check all (Production, Preview, Development)
   - Click "Save"

4. **Redeploy:**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger automatic deployment

### Step 3: Verify

After redeployment:
1. ✅ Build should succeed
2. ✅ Visit your Vercel URL
3. ✅ Open browser DevTools → Network tab
4. ✅ Try adding an employee
5. ✅ Verify API calls go to your Render backend

## What is VITE_API_URL?

- **Purpose:** Tells your frontend where your backend API is located
- **Local Development:** `http://localhost:8000`
- **Production:** Your Render backend URL (e.g., `https://hrms-backend.onrender.com`)

## Alternative: Use .env file (Local Development Only)

For local development, create `.env` in the `frontend` folder:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```

**Note:** This file is gitignored and won't be deployed. Use Vercel Dashboard for production.

---

## Quick Checklist

- [x] Updated `vercel.json` (removed secret reference)
- [ ] Set `VITE_API_URL` in Vercel Dashboard
- [ ] Get backend URL from Render (format: `https://your-service.onrender.com`)
- [ ] Redeploy on Vercel
- [ ] Test the deployed app

---

**Status:** Ready to set environment variable and redeploy! 🚀
