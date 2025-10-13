import React from 'react';
import './Badge.scss';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  dot = false
}) => {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot && 'badge--dot'
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      {dot && <span className="badge__dot"></span>}
      {children}
    </span>
  );
};

export default Badge;