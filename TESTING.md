# HRMS Lite - Testing Guide

This document provides a comprehensive testing checklist for the HRMS Lite application.

## 🧪 Prerequisites for Testing

Before testing, ensure:
- MongoDB Atlas is set up with connection string in `backend/.env`
- Backend is running on `http://localhost:8000`
- Frontend is running on `http://localhost:5173`

## Backend API Testing

### Method 1: Using Swagger UI (Recommended)

1. Open `http://localhost:8000/docs` in browser
2. You'll see interactive API documentation

### Method 2: Using curl

#### Test Root Endpoint
```bash
curl http://localhost:8000/
# Expected: {"message":"HRMS Lite API","status":"running"}
```

#### Test Health Check
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

#### Create Employee
```bash
curl -X POST "http://localhost:8000/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Engineering"
  }'
```

#### Get All Employees
```bash
curl http://localhost:8000/api/employees
```

#### Mark Attendance
```bash
curl -X POST "http://localhost:8000/api/attendance" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2026-01-31",
    "status": "Present"
  }'
```

#### Get Attendance Records
```bash
curl "http://localhost:8000/api/attendance"
```

#### Delete Employee
```bash
curl -X DELETE "http://localhost:8000/api/employees/EMP001"
```

---

## Frontend Testing Checklist

### 1. Employee Management Tests

#### ✅ Add Employee - Valid Data
**Steps:**
1. Go to "Employee Management" tab
2. Fill in all fields:
   - Employee ID: `EMP001`
   - Full Name: `John Doe`
   - Email: `john.doe@example.com`
   - Department: `Engineering`
3. Click "Add Employee"

**Expected Result:**
- Success message appears
- Form is cleared
- Employee appears in the list below

#### ✅ Add Employee - Duplicate ID
**Steps:**
1. Try to add another employee with ID `EMP001`

**Expected Result:**
- Error message: "Employee with ID EMP001 already exists"

#### ✅ Add Employee - Duplicate Email
**Steps:**
1. Try to add employee with different ID but same email

**Expected Result:**
- Error message: "Employee with email ... already exists"

#### ✅ Add Employee - Invalid Email
**Steps:**
1. Try to add employee with email: `notanemail`

**Expected Result:**
- Browser validation error (HTML5 validation)

#### ✅ Add Employee - Empty Fields
**Steps:**
1. Leave fields empty and try to submit

**Expected Result:**
- Browser validation prevents submission

#### ✅ View Employee List
**Steps:**
1. Check employee list table

**Expected Result:**
- All employees shown in table
- Employee count displayed in header
- Table shows: ID, Name, Email, Department, Actions

#### ✅ Delete Employee
**Steps:**
1. Click "Delete" button on an employee
2. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- After confirming, employee is removed
- Employee count updates
- Success (employee disappears)

#### ✅ Empty State
**Steps:**
1. Delete all employees

**Expected Result:**
- Message: "No employees found. Add your first employee above!"

---

### 2. Attendance Management Tests

#### ✅ Mark Attendance - Valid
**Steps:**
1. Go to "Attendance Management" tab
2. Add employee if none exists
3. Select employee from dropdown
4. Select date (today)
5. Select status (Present)
6. Click "Mark Attendance"

**Expected Result:**
- Success message
- Form resets
- Attendance appears in list below

#### ✅ Mark Attendance - Duplicate
**Steps:**
1. Try to mark attendance for same employee and date again

**Expected Result:**
- Error: "Attendance for employee ... on ... already exists"

#### ✅ Mark Attendance - Invalid Employee
**Steps:**
1. Check console, manually try invalid employee_id

**Expected Result:**
- Error: "Employee with ID ... not found"

#### ✅ Mark Attendance - Future Date
**Steps:**
1. Try to select a future date

**Expected Result:**
- Date picker blocks future dates (max=today)

#### ✅ View Attendance Records
**Steps:**
1. Check attendance list

**Expected Result:**
- All records shown
- Shows: Employee ID, Name, Date, Status
- Status has colored badge (green for Present, red for Absent)
- Records sorted by date (newest first)

#### ✅ Filter by Employee ID
**Steps:**
1. Enter employee ID in filter
2. Click "Apply Filter"

**Expected Result:**
- Only records for that employee shown

#### ✅ Filter by Date Range
**Steps:**
1. Select start date and end date
2. Click "Apply Filter"

**Expected Result:**
- Only records within date range shown

#### ✅ Clear Filters
**Steps:**
1. Apply some filters
2. Click "Clear Filter"

**Expected Result:**
- All filters cleared
- All records shown again

#### ✅ Empty State (No Employees)
**Steps:**
1. Delete all employees
2. Go to Attendance Management

**Expected Result:**
- Message: "No employees available. Please add employees first."
- Form is hidden

#### ✅ Empty State (No Attendance)
**Steps:**
1. Have employees but no attendance

**Expected Result:**
- Message: "No attendance records found."

---

### 3. UI/UX Tests

#### ✅ Responsive Design - Mobile
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or similar
4. Test all features

**Expected Result:**
- Layout adapts to mobile
- Navigation stacks vertically
- Forms are single column
- Tables scroll horizontally if needed
- All buttons accessible

#### ✅ Responsive Design - Tablet
**Steps:**
1. Test on tablet size (iPad)

**Expected Result:**
- Layout looks good
- Forms adapt appropriately
- Navigation works well

#### ✅ Responsive Design - Desktop
**Steps:**
1. Test on full desktop size

**Expected Result:**
- Content centered with max-width
- Forms show 2 columns
- Everything properly spaced

#### ✅ Loading States
**Steps:**
1. Observe when submitting forms
2. Watch when loading data

**Expected Result:**
- Buttons show "Loading..." or "Adding..."
- Buttons disabled during loading
- Loading message shown when fetching data

#### ✅ Error Handling
**Steps:**
1. Stop backend server
2. Try to add employee

**Expected Result:**
- Error message shown: "Failed to add employee"
- No crash, graceful error display

#### ✅ Navigation
**Steps:**
1. Switch between tabs
2. Check sticky navigation

**Expected Result:**
- Active tab highlighted
- Navigation sticks to top on scroll
- Smooth transitions

#### ✅ Form Validation
**Steps:**
1. Test all form inputs
2. Try invalid data

**Expected Result:**
- Required fields marked with *
- Email validation works
- Helpful error messages

---

### 4. Integration Tests

#### ✅ Full User Flow
**Steps:**
1. Add 3 employees
2. Mark attendance for all (2 Present, 1 Absent)
3. View attendance list
4. Filter by date
5. Filter by employee
6. Delete one employee
7. Verify attendance records also deleted

**Expected Result:**
- Everything works smoothly
- Data persists
- Filters work correctly
- Cascade delete works

#### ✅ Data Persistence
**Steps:**
1. Add employees and attendance
2. Refresh browser
3. Check data still there

**Expected Result:**
- All data persists in MongoDB
- Everything loads correctly

#### ✅ Multiple Browser Tabs
**Steps:**
1. Open app in two browser tabs
2. Add employee in tab 1
3. Refresh tab 2

**Expected Result:**
- Data syncs (after refresh)
- Both tabs work independently

---

### 5. Performance Tests

#### ✅ Load Time
**Steps:**
1. Open DevTools → Network
2. Refresh page
3. Check load times

**Expected Result:**
- Initial load < 2 seconds
- API calls < 500ms (local)

#### ✅ Many Records
**Steps:**
1. Add 20+ employees
2. Mark attendance for all
3. Test filters

**Expected Result:**
- UI remains responsive
- Scrolling is smooth
- Filters work quickly

---

### 6. Security Tests

#### ✅ SQL Injection (N/A for MongoDB)
**Steps:**
1. Try adding employee with ID: `'; DROP TABLE--`

**Expected Result:**
- Treated as normal string
- No security issue

#### ✅ XSS Prevention
**Steps:**
1. Add employee with name: `<script>alert('xss')</script>`

**Expected Result:**
- React escapes HTML automatically
- No script execution

#### ✅ CORS
**Steps:**
1. Check browser console for CORS errors

**Expected Result:**
- No CORS errors
- Backend properly configured

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Production Testing (After Deployment)

### ✅ Backend Health
**Steps:**
1. Visit backend URL
2. Visit `/docs` endpoint
3. Test API endpoints

**Expected Result:**
- All endpoints responding
- HTTPS working
- No CORS errors

### ✅ Frontend Live
**Steps:**
1. Visit frontend URL
2. Test all features
3. Check browser console

**Expected Result:**
- No console errors
- All features work
- API calls go to production backend

### ✅ End-to-End Production Test
**Steps:**
1. Complete full user flow on production
2. Test from multiple locations/devices

**Expected Result:**
- Everything works as expected
- Good performance
- No errors

---

## Bug Report Template

If you find issues:

```
**Bug Description:**
[What happened]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [...]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Environment: [Local/Production]

**Screenshots:**
[If applicable]

**Console Errors:**
[Any error messages]
```

---

## Testing Summary

### Critical Features (Must Work)
- [x] Add employee
- [x] View employees
- [x] Delete employee
- [x] Mark attendance
- [x] View attendance
- [x] Duplicate prevention
- [x] Form validation
- [x] Error handling

### Nice-to-Have Features (Should Work)
- [x] Filters
- [x] Responsive design
- [x] Loading states
- [x] Empty states
- [x] Professional UI

### All Features Tested ✅

---

**Ready for deployment!** 🚀
