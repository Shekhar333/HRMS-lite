import React, { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import AttendanceList from './components/AttendanceList';
import AddAttendance from './components/AddAttendance';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [refreshEmployees, setRefreshEmployees] = useState(0);
  const [refreshAttendance, setRefreshAttendance] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshEmployees(prev => prev + 1);
  };

  const handleEmployeeDeleted = () => {
    setRefreshEmployees(prev => prev + 1);
    setRefreshAttendance(prev => prev + 1);
  };

  const handleAttendanceMarked = () => {
    setRefreshAttendance(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>HRMS Lite</h1>
          <p>Human Resource Management System</p>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <button
            className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employee Management
          </button>
          <button
            className={`nav-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Management
          </button>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          {activeTab === 'employees' ? (
            <div className="section">
              <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
              <EmployeeList
                refresh={refreshEmployees}
                onEmployeeDeleted={handleEmployeeDeleted}
              />
            </div>
          ) : (
            <div className="section">
              <AddAttendance
                onAttendanceMarked={handleAttendanceMarked}
                refreshEmployees={refreshEmployees}
              />
              <AttendanceList refresh={refreshAttendance} />
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 HRMS Lite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
