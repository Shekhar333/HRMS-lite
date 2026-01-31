from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import date

class Employee(BaseModel):
    employee_id: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)

class EmployeeResponse(Employee):
    id: str

class Attendance(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: date
    status: Literal["Present", "Absent"]

class AttendanceResponse(Attendance):
    id: str
    employee_name: Optional[str] = None
