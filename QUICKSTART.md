# HRMS Lite - Quick Start Guide

This guide will help you get the application running in under 10 minutes.

## 🚀 Quick Setup (3 Steps)

### Step 1: Set Up MongoDB (2 minutes)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Create database user and password
7. Add IP: 0.0.0.0/0 (Allow from anywhere)

### Step 2: Run Backend (2 minutes)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy .env.example and edit)
# Add your MongoDB URL
nano .env

# Run server
python app.py
```

Backend runs on: http://localhost:8000

### Step 3: Run Frontend (2 minutes)

Open new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs on: http://localhost:5173

## ✅ Test It!

1. Open http://localhost:5173
2. Add an employee
3. Mark attendance
4. Done! 🎉

## 🌐 Deploy (10 minutes)

### Backend → Render
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect repo, set root: `backend`
4. Add environment variables
5. Deploy!

### Frontend → Vercel
1. Go to vercel.com → New Project
2. Import repo, set root: `frontend`
3. Add `VITE_API_URL` env variable
4. Deploy!

## 📚 Need Help?

See full README.md for detailed instructions.
