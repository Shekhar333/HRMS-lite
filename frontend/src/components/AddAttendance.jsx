import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';

// Validation schema
const attendanceSchema = z.object({
  employee_id: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['Present', 'Absent']),
});

function AddAttendance({ onAttendanceMarked, refreshEmployees }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [refreshEmployees]);

  const fetchEmployees = async () => {
    setSearchLoading(true);
    try {
      const response = await api.get('/api/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees');
      toast.error('Failed to load employees');
    } finally {
      setSearchLoading(false);
    }
  };

  // Search/filter employees
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowDropdown(true);
    setSelectedEmployee(null);
    setFormData(prev => ({ ...prev, employee_id: '' }));

    if (!query.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    // Search by employee_id or name (case-insensitive)
    const filtered = employees.filter(emp => 
      emp.employee_id.toLowerCase().includes(query.toLowerCase()) ||
      emp.full_name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
  };

  // Select employee from dropdown
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchQuery(`${employee.employee_id} - ${employee.full_name}`);
    setFormData(prev => ({ ...prev, employee_id: employee.employee_id }));
    setShowDropdown(false);
    setError('');
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedEmployee(null);
    setSearchQuery('');
    setFormData(prev => ({ ...prev, employee_id: '' }));
    setFilteredEmployees(employees);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate with Zod
    try {
      attendanceSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        setError(firstError.message);
        toast.error(firstError.message);
        return;
      }
    }

    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/attendance', formData);
      setSuccess('Attendance marked successfully!');
      toast.success(`✅ Attendance marked for ${selectedEmployee.full_name}`);
      
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      setSearchQuery('');
      setSelectedEmployee(null);
      setFilteredEmployees(employees);
      onAttendanceMarked();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to mark attendance';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <Toaster position="top-right" />
      <h2>Mark Attendance</h2>
      {employees.length === 0 ? (
        <div className="empty-state">
          <p>No employees available. Please add employees first.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="employee_search">
                Search Employee * 
                {searchLoading && <span style={{ marginLeft: '8px', color: '#f59e0b' }}>Loading...</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="employee_search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search by ID or Name..."
                  required
                  disabled={loading}
                  style={{
                    paddingRight: selectedEmployee ? '40px' : '12px',
                    borderColor: selectedEmployee ? '#16a34a' : ''
                  }}
                />
                {selectedEmployee && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#6b7280',
                      padding: '0 5px'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              
              {showDropdown && searchQuery && filteredEmployees.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  marginTop: '4px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  zIndex: 10
                }}>
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => handleSelectEmployee(employee)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontWeight: '500', color: '#111827' }}>
                        {employee.full_name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {employee.employee_id} • {employee.department}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showDropdown && searchQuery && filteredEmployees.length === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  marginTop: '4px',
                  padding: '12px 16px',
                  color: '#6b7280',
                  zIndex: 10
                }}>
                  No employees found
                </div>
              )}
              
              {selectedEmployee && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#065f46'
                }}>
                  ✓ Selected: {selectedEmployee.full_name} ({selectedEmployee.employee_id})
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Marking...' : 'Mark Attendance'}
          </button>
        </form>
      )}
    </div>
  );
}

export default AddAttendance;
