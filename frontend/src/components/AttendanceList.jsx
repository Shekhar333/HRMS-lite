import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function AttendanceList({ refresh }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    fetchAttendance();
  }, [refresh]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filter.employee_id) params.append('employee_id', filter.employee_id);
      if (filter.start_date) params.append('start_date', filter.start_date);
      if (filter.end_date) params.append('end_date', filter.end_date);

      const response = await api.get(`/api/attendance?${params.toString()}`);
      setAttendance(response.data);
    } catch (err) {
      setError('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  const handleClearFilter = () => {
    setFilter({
      employee_id: '',
      start_date: '',
      end_date: '',
    });
    setTimeout(() => fetchAttendance(), 0);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Loading attendance records...</div>
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
      <h2>Attendance Records ({attendance.length})</h2>
      
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="filter_employee_id">Employee ID</label>
            <input
              type="text"
              id="filter_employee_id"
              name="employee_id"
              value={filter.employee_id}
              onChange={handleFilterChange}
              placeholder="Filter by Employee ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="filter_start_date">Start Date</label>
            <input
              type="date"
              id="filter_start_date"
              name="start_date"
              value={filter.start_date}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="filter_end_date">End Date</label>
            <input
              type="date"
              id="filter_end_date"
              name="end_date"
              value={filter.end_date}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="filter-actions">
          <button type="submit" className="btn btn-secondary btn-small">
            Apply Filter
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
        </div>
      </form>

      {attendance.length === 0 ? (
        <div className="empty-state">
          <p>No attendance records found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee_id}</td>
                  <td>{record.employee_name}</td>
                  <td>{record.date}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
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

export default AttendanceList;
