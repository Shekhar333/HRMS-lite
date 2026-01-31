import React from 'react';

function ActionButton({ 
  variant = 'primary',
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  ...rest 
}) {
  const getButtonClass = () => {
    const baseClasses = ['btn-small'];
    
    switch (variant) {
      case 'danger':
        baseClasses.push('btn-danger');
        break;
      case 'secondary':
        baseClasses.push('btn-secondary');
        break;
      case 'primary':
      default:
        baseClasses.push('btn-primary');
        break;
    }
    
    if (className) {
      baseClasses.push(className);
    }
    
    return baseClasses.join(' ');
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
}

export default ActionButton;
