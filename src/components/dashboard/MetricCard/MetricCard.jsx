import React from 'react';
import './MetricCard.scss';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  onClick 
}) => {
  return (
    <div 
      className={`metric-card metric-card--${gradient}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="metric-info">
        <div className="metric-number">{value}</div>
        <div className="metric-label">{title}</div>
      </div>
      <div className="metric-icon">
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;