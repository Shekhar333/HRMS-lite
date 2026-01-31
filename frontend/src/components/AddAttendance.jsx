import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';
import SearchableDropdown from './common/SearchableDropdown';
import InputWithClear from './common/InputWithClear';
import FormField from './common/FormField';
import SelectedBadge from './common/SelectedBadge';

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

    const filtered = employees.filter(emp => 
      emp.employee_id.toLowerCase().includes(query.toLowerCase()) ||
      emp.full_name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSearchQuery(`${employee.employee_id} - ${employee.full_name}`);
    setFormData(prev => ({ ...prev, employee_id: employee.employee_id }));
    setShowDropdown(false);
    setError('');
  };

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
      toast.success(`Attendance marked for ${selectedEmployee.full_name}`);
      
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
            <div style={{ position: 'relative' }}>
              <FormField
                label="Search Employee"
                htmlFor="employee_search"
                required
                status={searchLoading ? 'Loading...' : null}
                statusType="loading"
              >
                <InputWithClear
                  id="employee_search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(true)}
                  success={!!selectedEmployee}
                  placeholder="Search by ID or Name..."
                  disabled={loading}
                  required
                />
              </FormField>
              
              <SearchableDropdown
                items={filteredEmployees}
                searchQuery={searchQuery}
                showDropdown={showDropdown}
                onSelect={handleSelectEmployee}
                emptyMessage="No employees found"
              />
              
              {selectedEmployee && (
                <SelectedBadge 
                  text={`Selected: ${selectedEmployee.full_name} (${selectedEmployee.employee_id})`}
                  variant="success"
                />
              )}
            </div>

            <FormField
              label="Date"
              htmlFor="date"
              required
            >
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
            </FormField>

            <FormField
              label="Status"
              htmlFor="status"
              required
            >
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
            </FormField>
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
