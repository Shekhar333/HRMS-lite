# HRMS Lite - Getting Started 🚀

Welcome! This guide will get you up and running in **5 minutes**.

## 📋 What You Have

A complete, production-ready HRMS Lite application with:
- ✅ Backend (FastAPI + MongoDB)
- ✅ Frontend (React + Vite)
- ✅ Complete documentation
- ✅ Deployment guides
- ✅ Helper scripts

## 🎯 Quick Start (Choose One)

### Option A: Use Helper Scripts (Easiest)

```bash
# 1. Setup MongoDB and environment
./setup.sh

# 2. Edit backend/.env with your MongoDB URL
nano backend/.env

# 3. Start backend (in terminal 1)
./start-backend.sh

# 4. Start frontend (in terminal 2)
./start-frontend.sh

# 5. Open http://localhost:5173
```

### Option B: Manual Setup

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Edit .env with your MongoDB URL
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🔧 Before You Start

### 1. Get MongoDB Connection String (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create free cluster (M0)
3. Database Access → Add user → Save credentials
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → "Connect your application" → Copy string
6. Paste in `backend/.env` as `MONGODB_URL`

### 2. Verify Everything Works

Once both servers are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📚 Documentation

- **README.md** - Complete project documentation
- **QUICKSTART.md** - 10-minute setup guide
- **DEPLOYMENT.md** - Step-by-step deployment to Render + Vercel
- **TESTING.md** - Complete testing checklist
- **SUBMISSION.md** - Assignment submission summary

## 🚀 Deploy to Production

When ready to deploy:

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# Then follow DEPLOYMENT.md for:
# - Deploy backend to Render
# - Deploy frontend to Vercel
```

## 🎯 Project Structure

```
HRMS-Lite/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── *.sh              # Helper scripts
└── *.md              # Documentation
```

## ✨ Features Implemented

### Employee Management
- ✅ Add employees with validation
- ✅ View all employees
- ✅ Delete employees

### Attendance Management
- ✅ Mark daily attendance
- ✅ View attendance records
- ✅ Filter by employee/date

### Professional UI
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states

### Bonus Features
- ✅ Date range filters
- ✅ Status badges
- ✅ Record counts
- ✅ Interactive API docs

## 🆘 Need Help?

### Common Issues

**MongoDB connection fails:**
- Check connection string in `backend/.env`
- Verify IP whitelist in MongoDB Atlas (0.0.0.0/0)
- Ensure database user credentials are correct

**Frontend can't connect to backend:**
- Verify backend is running on port 8000
- Check `VITE_API_URL` in `frontend/.env`
- Look for CORS errors in browser console

**Port already in use:**
- Change PORT in `backend/.env`
- Or stop the process using that port

### Get More Help

1. Check the relevant documentation file
2. Review error messages in console
3. Check browser DevTools → Console/Network tabs

## 🎯 Next Steps

1. ✅ **Test Locally**
   - Add some employees
   - Mark attendance
   - Test all features

2. 🌐 **Deploy**
   - Follow DEPLOYMENT.md
   - Deploy backend to Render
   - Deploy frontend to Vercel

3. 📝 **Submit**
   - Update SUBMISSION.md with live URLs
   - Push final code to GitHub
   - Submit repository link

## 💡 Tips

- Use the API docs at `/docs` to test backend directly
- Check browser console for any errors
- MongoDB Atlas dashboard shows connection status
- Render/Vercel dashboards show deployment logs

## 🎉 You're All Set!

The application is complete and ready to deploy. Follow the steps above and you'll have a live application in no time!

**Happy coding!** 🚀

---

**Questions?** Check the documentation files or see the inline code comments.
