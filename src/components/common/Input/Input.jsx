import React, { forwardRef } from 'react';
import './Input.scss';

const Input = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon,
  fullWidth = false,
  ...props
}, ref) => {
  const inputClasses = [
    'input-field',
    error && 'input-field--error',
    disabled && 'input-field--disabled',
    fullWidth && 'input-field--full-width'
  ].filter(Boolean).join(' ');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-label__required"> *</span>}
        </label>
      )}
      
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>

      {error && <span className="input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;