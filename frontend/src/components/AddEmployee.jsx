import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import api from '../api/axios';
import { FormField, InputWithClear, RefreshIcon } from './common';

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <FormField
            label="Full Name"
            htmlFor="full_name"
            required
          >
            <InputWithClear
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              required
            />
          </FormField>

          <FormField
            label="Employee ID"
            htmlFor="employee_id"
            required
            status={
              checkingId ? 'Checking...' :
              idExists ? 'Already exists!' :
              formData.employee_id ? 'Available ✓' : null
            }
            statusType={
              checkingId ? 'loading' :
              idExists ? 'error' :
              formData.employee_id ? 'success' : 'info'
            }
          >
            <div style={{ position: 'relative', display: 'block', width: '100%' }}>
              <InputWithClear
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="Enter ID or Generate"
                disabled={loading}
                required
                success={!checkingId && !idExists && !!formData.employee_id}
                style={{
                  width: '100%',
                  paddingRight: '45px',
                  borderColor: idExists ? 'var(--danger-color)' : ''
                }}
              />
              <button
                type="button"
                onClick={handleGenerateId}
                disabled={loading || checkingId}
                title="Generate ID"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: loading || checkingId ? 'not-allowed' : 'pointer',
                  padding: '0',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading || checkingId ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                  height: '24px',
                  width: '24px',
                  zIndex: 10
                }}
              >
                <RefreshIcon size={18} color="#36C236" />
              </button>
            </div>
          </FormField>

          <FormField
            label="Email Address"
            htmlFor="email"
            required
          >
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </FormField>

          <FormField
            label="Department"
            htmlFor="department"
            required
          >
            <InputWithClear
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering, HR, Sales"
              disabled={loading}
              required
            />
          </FormField>
        </div>
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
