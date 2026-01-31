# HRMS Lite - Human Resource Management System

A lightweight, full-stack web application for managing employees and tracking attendance.

## 🚀 Live Demo

- **Frontend**: Deploy on Vercel (instructions below)
- **Backend API**: Deploy on Render (instructions below)
- **GitHub**: Your Repository URL

## 📋 Features

### Employee Management
- ✅ Add new employees with unique ID, name, email, and department
- ✅ View all employees in a clean table layout
- ✅ Delete employees (with cascade deletion of attendance records)
- ✅ Email and Employee ID validation with duplicate prevention

### Attendance Management
- ✅ Mark daily attendance (Present/Absent)
- ✅ View attendance history
- ✅ Filter attendance by employee ID and date range
- ✅ Automatic validation to prevent duplicate entries

### Professional UI
- ✅ Responsive design for all screen sizes
- ✅ Loading states and error handling
- ✅ Empty states with helpful messages
- ✅ Clean, modern interface with smooth transitions

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (with Motor for async operations)
- **Validation**: Pydantic
- **CORS**: Enabled for cross-origin requests
- **Deployment**: Render

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS variables
- **Deployment**: Vercel

## 📦 Installation & Local Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB account (MongoDB Atlas recommended - free tier available)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd HRMS-Lite
```

### Step 2: Set Up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and log in
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Create a database user with password
7. Whitelist all IP addresses: Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

### Step 3: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Edit `.env` and add your MongoDB connection string:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=hrms_lite
CORS_ORIGINS=http://localhost:5173
PORT=8000
```

6. Run the backend server:
```bash
python app.py
```

Backend will run on `http://localhost:8000`

7. Test the API:
   - Open browser: `http://localhost:8000` (should show API status)
   - API Documentation: `http://localhost:8000/docs` (interactive Swagger UI)

### Step 4: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured for local development:
```env
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

5. Open your browser and visit `http://localhost:5173`

## 🌐 Deployment Instructions

### Deploy Backend on Render

1. **Create GitHub Repository**
   - Push your code to GitHub
   - Make sure `.gitignore` files are properly set

2. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure Service**
   - **Name**: `hrms-lite-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   MONGODB_URL = mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME = hrms_lite
   CORS_ORIGINS = https://your-frontend-url.vercel.app,http://localhost:5173
   ```
   
   Note: You'll add the Vercel URL after deploying frontend

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://hrms-lite-backend.onrender.com`)

### Deploy Frontend on Vercel

1. **Update Frontend Environment Variable**
   
   Before deploying, you may want to create a production environment file, or you'll set it in Vercel dashboard:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Install Vercel CLI** (optional, you can also use Vercel website)
   ```bash
   npm install -g vercel
   ```

3. **Deploy via Vercel CLI**
   ```bash
   cd frontend
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - What's your project name? `hrms-lite`
   - In which directory is your code? `./`
   - Want to override settings? `N`

4. **Or Deploy via Vercel Website**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
5. **Add Environment Variable in Vercel**
   - Go to your project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

6. **Redeploy**
   - Go to Deployments → Click on the latest deployment → "Redeploy"

7. **Update Backend CORS**
   - Go back to Render
   - Update `CORS_ORIGINS` environment variable to include your Vercel URL:
     ```
     CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
     ```
   - Render will automatically redeploy

### Verify Deployment

1. Visit your Vercel frontend URL
2. Try adding an employee
3. Try marking attendance
4. Check that all features work properly

## 📝 API Documentation

Once the backend is running, visit `/docs` endpoint for interactive API documentation:
- Local: `http://localhost:8000/docs`
- Production: `https://your-backend.onrender.com/docs`

### Key Endpoints

#### Employee Endpoints
- `POST /api/employees` - Create new employee
- `GET /api/employees` - Get all employees
- `DELETE /api/employees/{employee_id}` - Delete employee

#### Attendance Endpoints
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance records (supports query params: `employee_id`, `start_date`, `end_date`)
- `GET /api/attendance/summary/{employee_id}` - Get attendance summary for an employee

#### Health Check
- `GET /` - API status
- `GET /health` - Health check

## 🧪 Testing the Application

### Manual Testing Checklist

**Employee Management:**
- [ ] Add a new employee with all fields
- [ ] Try to add duplicate employee ID (should fail)
- [ ] Try to add duplicate email (should fail)
- [ ] View employee list
- [ ] Delete an employee
- [ ] Verify employee is removed from list

**Attendance Management:**
- [ ] Mark attendance for an employee
- [ ] Try to mark duplicate attendance for same date (should fail)
- [ ] View all attendance records
- [ ] Filter by employee ID
- [ ] Filter by date range
- [ ] Clear filters

**UI/UX:**
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Check loading states
- [ ] Check error messages
- [ ] Check empty states

## 🎯 Project Structure

```
HRMS-Lite/
├── backend/
│   ├── app.py              # Main FastAPI application
│   ├── models.py           # Pydantic models
│   ├── database.py         # MongoDB connection
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variables template
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── main.jsx        # React entry point
    │   ├── App.jsx         # Main App component
    │   ├── api/
    │   │   └── axios.js    # API client configuration
    │   ├── components/
    │   │   ├── AddEmployee.jsx
    │   │   ├── EmployeeList.jsx
    │   │   ├── AddAttendance.jsx
    │   │   └── AttendanceList.jsx
    │   └── styles/
    │       └── App.css     # All styles
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .gitignore
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb+srv://...           # MongoDB connection string
DATABASE_NAME=hrms_lite                 # Database name
CORS_ORIGINS=http://localhost:5173     # Comma-separated allowed origins
PORT=8000                               # Server port (optional)
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000     # Backend API URL
```

## 🚨 Troubleshooting

### Backend Issues

**"Connection refused" or MongoDB connection errors:**
- Verify MongoDB connection string is correct
- Check if IP address is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

**CORS errors:**
- Make sure frontend URL is in `CORS_ORIGINS`
- Restart backend after changing environment variables

**Port already in use:**
- Change PORT in `.env` file
- Or kill the process using the port

### Frontend Issues

**"Network Error" when calling API:**
- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Open browser console for detailed errors

**Blank page:**
- Check browser console for errors
- Verify all dependencies are installed (`npm install`)

**Build fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📊 Assumptions & Limitations

- ✅ Single admin user (no authentication/authorization required)
- ✅ No edit functionality for employees or attendance records
- ✅ Attendance can only be marked once per employee per day
- ✅ No advanced reporting or analytics dashboard
- ✅ No role-based access control
- ✅ No password management or user sessions
- ✅ Date selection limited to past and current dates only

## 🎁 Bonus Features Implemented

- ✅ Filter attendance records by date range
- ✅ Filter attendance by employee ID
- ✅ Display total employee count
- ✅ Display total attendance records count
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Professional error handling with user-friendly messages
- ✅ Loading states for all async operations
- ✅ Empty states with helpful guidance
- ✅ Color-coded status badges for attendance

## 🤝 Contributing

This is an assignment project. For issues or suggestions, please create an issue in the repository.

## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

## 🎉 Submission Checklist

Before submitting, ensure:

- [x] Backend code is complete and tested
- [x] Frontend code is complete and tested
- [x] Backend is deployed on Render
- [x] Frontend is deployed on Vercel
- [x] Live application is accessible without errors
- [x] GitHub repository is public with complete code
- [x] README.md contains all necessary information
- [x] All core features are working:
  - [x] Add employee
  - [x] View employees
  - [x] Delete employee
  - [x] Mark attendance
  - [x] View attendance
- [x] Error handling is implemented
- [x] UI is professional and responsive

## 📞 Support

For any questions or issues, please create an issue in the GitHub repository.

---

**Built with ❤️ using FastAPI, React, and MongoDB**
