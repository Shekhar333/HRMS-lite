import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';

// Validation schemas
const employeeSchema = z.object({
  employee_id: z.string()
    .min(1, { message: 'Employee ID is required' }),
  
  full_name: z.string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' })
    .regex(/^[a-zA-Z\s.'-]+$/, { message: 'Name can only contain letters, spaces, dots, hyphens and apostrophes' }),
  
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  
  department: z.string()
    .min(1, { message: 'Department is required' }),
});

function AddEmployee({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [checkingId, setCheckingId] = useState(false);
  const [idExists, setIdExists] = useState(false);

  // Generate employee ID from name
  const generateEmployeeId = (name) => {
    if (!name) {
      // Generate random ID if no name provided
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `EMP${randomNum}`;
    }
    
    // Convert to uppercase, remove special characters, take first 3 letters
    const namePart = name
      .toUpperCase()
      .replace(/[^A-Z\s]/g, '')
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 3);
    
    // Add random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${namePart || 'EMP'}${randomNum}`;
  };

  // Handle Generate ID button click
  const handleGenerateId = () => {
    const newId = generateEmployeeId(formData.full_name);
    setFormData(prev => ({ ...prev, employee_id: newId }));
      
      // Show toast with generated ID
      
    // Check if ID exists
    checkEmployeeIdExists(newId);
  };

  // Check if employee ID exists in database
  const checkEmployeeIdExists = async (employeeId) => {
    if (!employeeId || employeeId.trim() === '') {
      setIdExists(false);
      return;
    }
    
    setCheckingId(true);
    try {
      const response = await api.get('/api/employees');
      const exists = response.data.some(emp => emp.employee_id === employeeId);
      setIdExists(exists);
      
      if (exists) {
        toast.error(`Employee ID "${employeeId}" already exists!`, {
          duration: 3000,
        });
      } else {
        toast.success(`Employee ID "${employeeId}" is available!`, {
          duration: 2000,
        });
      }
    } catch (err) {
      toast.error('Failed to check Employee ID');
    } finally {
      setCheckingId(false);
    }
  };

  // Debounce ID check when user types manually
  useEffect(() => {
    if (formData.employee_id) {
      const timer = setTimeout(() => {
        checkEmployeeIdExists(formData.employee_id);
      }, 800); // 800ms debounce
      
      return () => clearTimeout(timer);
    } else {
      setIdExists(false);
      setCheckingId(false);
    }
  }, [formData.employee_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
    
    // Reset idExists when user starts typing in employee_id
    if (name === 'employee_id') {
      setIdExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    setSuccess('');
    
    // Validate with Zod
    const validationResult = employeeSchema.safeParse(formData);
    
    if (!validationResult.success) {
      // Get all validation errors
      console.log('🔴 Validation failed! Full result:', validationResult); // Debug log
      console.log('🔴 Validation error object:', validationResult.error); // Debug log
      
      const errors = validationResult.error?.issues || validationResult.error?.errors || [];
      console.log('🔴 Extracted errors:', errors); // Debug log
      
      // Map field names to display names
      const fieldDisplayNames = {
        employee_id: 'Employee ID',
        full_name: 'Full Name',
        email: 'Email Address',
        department: 'Department',
      };
      
      // Create detailed error messages with field names
      const errorMessages = errors.map(err => {
        const fieldName = fieldDisplayNames[err.path?.[0]] || err.path?.[0] || 'Unknown field';
        const errorMessage = `${fieldName}: ${err.message}`;
        // console.log('🔴 Error:', errorMessage); // Debug each error
        return errorMessage;
      });
      
      errorMessages.forEach((msg, index) => {
        setTimeout(() => {
          toast.error(msg, {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#ef4444',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          });
        }, index * 150);
      });
      
      // Join all errors for the error message box
      const displayMessage = errorMessages.join('\n');
      setError(displayMessage);
      
      // Also show a general validation error toast
      
      return;
    }

    if (idExists) {
      const errorMsg = 'Employee ID: Already exists - please use a different ID';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 5000,
        position: 'top-right',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting employee data:', formData); // Debug log
      const response = await api.post('/api/employees', formData);
      console.log('Employee added successfully:', response.data); // Debug log
      
      setSuccess('Employee added successfully!');
      toast.success('Employee added successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
      setIdExists(false);
      setCheckingId(false);
      onEmployeeAdded();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error adding employee:', err); // Debug log
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to add employee';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`, {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="employee_id">
              Employee ID * 
              {checkingId && <span style={{ marginLeft: '8px', color: '#f59e0b', fontSize: '0.875rem' }}>Checking...</span>}
              {!checkingId && idExists && <span style={{ marginLeft: '8px', color: '#dc2626', fontSize: '0.875rem' }}>Already exists!</span>}
              {!checkingId && !idExists && formData.employee_id && (
                <span style={{ marginLeft: '8px', color: '#16a34a', fontSize: '0.875rem' }}>Available ✓</span>
              )}
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter ID or Generate"
                style={{
                  width: '100%',
                  paddingRight: '110px',
                  borderColor: idExists ? '#dc2626' : (!checkingId && formData.employee_id ? '#16a34a' : '')
                }}
              />
              <button
                type="button"
                onClick={handleGenerateId}
                disabled={loading || checkingId}
                className="btn"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '4px',
                  backgroundColor: '#36C236',
                  transform: 'translateY(-50%)',
                  padding: '8px 16px',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  zIndex: 2,
                  height: '80%' // keeps button height close to input
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
                  <path d="M23 4v6h-6" />
                  <path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
                  <path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14" />
                </svg>
              </button>
            </div>
            
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        {/* <div className="form-row">
          
        </div> */}
        {error && (
          <div className="error-message">
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>Validation Errors:</div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {error.split('\n').map((line, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
        {success && <div className="success-message">{success}</div>}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
