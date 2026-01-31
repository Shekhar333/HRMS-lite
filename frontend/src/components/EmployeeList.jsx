import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ActionButton, DeleteIcon } from './common';

function EmployeeList({ refresh, onEmployeeDeleted }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, [refresh]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    setDeleting(employeeId);
    try {
      await api.delete(`/api/employees/${employeeId}`);
      onEmployeeDeleted();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete employee');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Employee List ({employees.length})</h2>
      {employees.length === 0 ? (
        <div className="empty-state">
          <p>No employees found. Add your first employee above!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.full_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>
                    <ActionButton
                      variant="danger"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(employee.employee_id)}
                      disabled={deleting === employee.employee_id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
