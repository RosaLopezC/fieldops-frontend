import React from 'react';
import './Card.scss';

const Card = ({ 
  children, 
  title, 
  subtitle,
  actions,
  noPadding = false,
  hoverable = false,
  onClick
}) => {
  const cardClasses = [
    'card',
    hoverable && 'card--hoverable',
    onClick && 'card--clickable'
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle || actions) && (
        <div className="card__header">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      
      <div className={`card__body ${noPadding ? 'card__body--no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;