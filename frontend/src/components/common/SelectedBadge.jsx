import React from 'react';

function SelectedBadge({ text, variant = 'success' }) {
  const variantStyles = {
    success: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    info: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    warning: {
      backgroundColor: '#fed7aa',
      color: '#92400e'
    }
  };

  return (
    <div className="selected-employee" style={variantStyles[variant]}>
      ✓ {text}
    </div>
  );
}

export default SelectedBadge;
