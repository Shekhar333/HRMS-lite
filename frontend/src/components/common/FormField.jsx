import React from 'react';

function FormField({ 
  label, 
  htmlFor, 
  children, 
  required = false,
  status = null,
  statusType = 'info',
  helperText = null
}) {
  const statusColors = {
    loading: 'var(--warning-color)',
    error: 'var(--danger-color)',
    success: 'var(--success-color)',
    info: 'var(--gray-500)'
  };

  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>
        {label} {required && '*'}
        {status && (
          <span style={{ 
            marginLeft: '8px', 
            color: statusColors[statusType],
            fontSize: '0.875rem',
            fontWeight: '400'
          }}>
            {status}
          </span>
        )}
      </label>
      {children}
      {helperText && (
        <small>{helperText}</small>
      )}
    </div>
  );
}

export default FormField;
