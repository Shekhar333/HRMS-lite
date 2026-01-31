import React from 'react';

function InputWithClear({ 
  value, 
  onChange, 
  placeholder = '',
  disabled = false,
  success = false,
  ...rest 
}) {
  const inputStyle = success ? {
    borderColor: 'var(--success-color)'
  } : undefined;

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={inputStyle}
      {...rest}
    />
  );
}

export default InputWithClear;
