import React from 'react';
import './Button.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  icon,
  loading = false
}) => {
  // ⭐ Detectar si es solo icono
  const isIconOnly = icon && !children;

  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
    loading && 'btn--loading',
    isIconOnly && 'btn--icon-only'  // ⭐ NUEVA CLASE
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? (
        <span className="btn__spinner"></span>
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          {children && <span className="btn__text">{children}</span>}
        </>
      )}
    </button>
  );
};

export default Button;