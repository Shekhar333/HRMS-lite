from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List
import os
from dotenv import load_dotenv
from datetime import date

from database import connect_to_mongo, close_mongo_connection, get_database
from models import Employee, EmployeeResponse, Attendance, AttendanceResponse

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(title="HRMS Lite API", version="1.0.0", lifespan=lifespan)

# CORS configuration
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
CORS_ORIGINS = ["*"] if cors_origins_str == "*" else cors_origins_str.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "HRMS Lite API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Employee Endpoints

@app.post("/api/employees", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: Employee):
    db = get_database()
    
    # Check for duplicate employee_id
    existing = await db.employees.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID {employee.employee_id} already exists"
        )
    
    # Check for duplicate email
    existing_email = await db.employees.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with email {employee.email} already exists"
        )
    
    employee_dict = employee.model_dump()
    result = await db.employees.insert_one(employee_dict)
    
    created_employee = await db.employees.find_one({"_id": result.inserted_id})
    created_employee["id"] = str(created_employee["_id"])
    
    return EmployeeResponse(**created_employee)

@app.get("/api/employees", response_model=List[EmployeeResponse])
async def get_employees():
    db = get_database()
    employees = []
    
    async for employee in db.employees.find():
        employee["id"] = str(employee["_id"])
        employees.append(EmployeeResponse(**employee))
    
    return employees

@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    db = get_database()
    
    result = await db.employees.delete_one({"employee_id": employee_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    # Also delete all attendance records for this employee
    await db.attendance.delete_many({"employee_id": employee_id})
    
    return None

# Attendance Endpoints

@app.post("/api/attendance", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: Attendance):
    db = get_database()
    
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {attendance.employee_id} not found"
        )
    
    # Check if attendance already marked for this date
    existing = await db.attendance.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat()
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance for employee {attendance.employee_id} on {attendance.date} already exists"
        )
    
    attendance_dict = attendance.model_dump()
    attendance_dict["date"] = attendance.date.isoformat()
    
    result = await db.attendance.insert_one(attendance_dict)
    
    created_attendance = await db.attendance.find_one({"_id": result.inserted_id})
    created_attendance["id"] = str(created_attendance["_id"])
    created_attendance["date"] = date.fromisoformat(created_attendance["date"])
    created_attendance["employee_name"] = employee["full_name"]
    
    return AttendanceResponse(**created_attendance)

@app.get("/api/attendance", response_model=List[AttendanceResponse])
async def get_attendance(employee_id: str = None, start_date: str = None, end_date: str = None):
    db = get_database()
    
    query = {}
    if employee_id:
        query["employee_id"] = employee_id
    
    if start_date and end_date:
        query["date"] = {"$gte": start_date, "$lte": end_date}
    elif start_date:
        query["date"] = {"$gte": start_date}
    elif end_date:
        query["date"] = {"$lte": end_date}
    
    attendance_list = []
    
    async for record in db.attendance.find(query).sort("date", -1):
        employee = await db.employees.find_one({"employee_id": record["employee_id"]})
        record["id"] = str(record["_id"])
        record["date"] = date.fromisoformat(record["date"])
        record["employee_name"] = employee["full_name"] if employee else "Unknown"
        attendance_list.append(AttendanceResponse(**record))
    
    return attendance_list

@app.get("/api/attendance/summary/{employee_id}")
async def get_attendance_summary(employee_id: str):
    db = get_database()
    
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    total_present = await db.attendance.count_documents({
        "employee_id": employee_id,
        "status": "Present"
    })
    
    total_absent = await db.attendance.count_documents({
        "employee_id": employee_id,
        "status": "Absent"
    })
    
    return {
        "employee_id": employee_id,
        "employee_name": employee["full_name"],
        "total_present": total_present,
        "total_absent": total_absent,
        "total_days": total_present + total_absent
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
