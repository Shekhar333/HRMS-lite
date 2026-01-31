# Deploy HRMS-Lite Backend on Render with Docker

## ✅ Solution: Use Docker Deployment

Since Render is having issues with Python 3.13 and Rust compilation, we'll use Docker instead. This gives us full control over the Python version and dependencies.

## 📋 Prerequisites

- GitHub repository with your code
- Render account
- MongoDB Atlas connection string

## 🚀 Steps to Deploy

### Step 1: Ensure Files Are Ready

All required files are already in your project:
- ✅ `Dockerfile` - Docker configuration
- ✅ `.dockerignore` - Optimizes Docker build
- ✅ `build.sh` - Build script (not needed for Docker but kept for reference)
- ✅ `runtime.txt` - Python version (not needed for Docker but kept)

### Step 2: Push to GitHub

```bash
cd /Users/shivam/HRMS-Lite
git add .
git commit -m "feat: Add Docker support for Render deployment"
git push
```

### Step 3: Create Web Service on Render

1. **Go to Render Dashboard**
   - https://dashboard.render.com/

2. **Click "New +" → "Web Service"**

3. **Connect Your Repository**
   - Select your GitHub repository
   - Click "Connect"

4. **Configure Service:**
   ```
   Name: hrms-backend (or your choice)
   Region: Choose closest to your users
   Branch: main (or your default branch)
   
   Root Directory: (leave empty)
   
   Environment: Docker  ⚠️ IMPORTANT: Select "Docker" not "Python"
   
   Dockerfile Path: ./Dockerfile
   
   Docker Build Context Directory: .
   
   Instance Type: Free
   ```

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   ```
   MONGODB_URL = mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME = hrms_db
   CORS_ORIGINS = *
   PORT = 8000
   ```
   
   ⚠️ **Important:** Replace `MONGODB_URL` with your actual MongoDB Atlas connection string

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for build (3-5 minutes)
   - Docker will use Python 3.11 and install all dependencies correctly

### Step 4: Verify Deployment

1. **Check Build Logs:**
   - Should see "Build successful"
   - No Rust or compilation errors

2. **Test API:**
   - Visit: `https://your-service.onrender.com`
   - Should see: `{"message":"HRMS Lite API","status":"running"}`

3. **Test Swagger UI:**
   - Visit: `https://your-service.onrender.com/docs`
   - Try the GET /api/employees endpoint

4. **Copy Your Backend URL:**
   - Format: `https://your-service.onrender.com`
   - You'll need this for Vercel frontend deployment

## 🎯 Why Docker Works

1. ✅ **Fixed Python Version**: Uses Python 3.11 (not 3.13)
2. ✅ **Pre-built Wheels**: Python 3.11 has binary wheels for all packages
3. ✅ **No Rust Required**: All dependencies install from wheels
4. ✅ **Consistent Environment**: Same environment everywhere
5. ✅ **Faster Builds**: Docker caches layers

## 📊 Comparison: Python vs Docker on Render

| Feature | Python Environment | Docker (✅ Recommended) |
|---------|-------------------|------------------------|
| Python Version | 3.13 (causes issues) | 3.11 (stable) |
| Build Time | 5-10 min | 3-5 min |
| Rust Required | Yes (fails) | No |
| Binary Wheels | Not available | Available |
| Success Rate | ❌ Failing | ✅ Working |

## 🔄 After Deployment

### Update Frontend with Backend URL

1. **Go to Vercel Dashboard**
2. **Your Project → Settings → Environment Variables**
3. **Add/Update:**
   ```
   VITE_API_URL = https://your-backend.onrender.com
   ```
4. **Redeploy frontend**

### Update CORS if Needed

If you get CORS errors:
1. Go to Render → Your Service → Environment
2. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
   ```
3. Save (will auto-redeploy)

## 🐛 Troubleshooting

### Build Still Failing?

1. **Check Dockerfile path in Render settings**
2. **Verify environment variables are set**
3. **Check build logs for specific errors**
4. **Try manual deploy: "Clear build cache & deploy"**

### Container Won't Start?

1. **Check if PORT environment variable is set**
2. **Verify MongoDB connection string is correct**
3. **Check application logs in Render dashboard**

### Test Docker Locally (Optional)

```bash
# Build
docker build -t hrms-backend .

# Run
docker run -p 8000:8000 \
  -e MONGODB_URL="your_mongodb_url" \
  -e DATABASE_NAME="hrms_db" \
  -e CORS_ORIGINS="*" \
  hrms-backend

# Test
curl http://localhost:8000
curl http://localhost:8000/docs
```

## ✨ Success Checklist

- [ ] Dockerfile exists in project root
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Environment selected as "Docker" (not Python)
- [ ] Environment variables configured
- [ ] Build succeeded
- [ ] API responding at /docs
- [ ] Backend URL copied for frontend

---

**Status:** Ready to deploy with Docker! 🐳🚀
