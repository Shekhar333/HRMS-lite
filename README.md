# HRMS Lite - Human Resource Management System

A lightweight, full-stack web application for managing employees and tracking attendance.


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
   
   Note: You'll add the Vercel URL after deploying frontend

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
