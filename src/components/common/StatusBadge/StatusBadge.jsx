import React from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaExclamationCircle,
  FaCircle,
  FaPauseCircle
} from 'react-icons/fa';
import './StatusBadge.scss';

const StatusBadge = ({ 
  status, 
  label = null, 
  size = 'medium', // small, medium, large
  showIcon = true,
  variant = 'default' // default, outline
}) => {
  const statusConfig = {
    activo: {
      label: 'Activo',
      color: 'success',
      icon: <FaCheckCircle />
    },
    inactivo: {
      label: 'Inactivo',
      color: 'danger',
      icon: <FaTimesCircle />
    },
    pendiente: {
      label: 'Pendiente',
      color: 'warning',
      icon: <FaClock />
    },
    aprobado: {
      label: 'Aprobado',
      color: 'success',
      icon: <FaCheckCircle />
    },
    rechazado: {
      label: 'Rechazado',
      color: 'danger',
      icon: <FaTimesCircle />
    },
    observado: {
      label: 'Observado',
      color: 'warning',
      icon: <FaExclamationCircle />
    },
    proceso: {
      label: 'En Proceso',
      color: 'info',
      icon: <FaCircle />
    },
    completado: {
      label: 'Completado',
      color: 'success',
      icon: <FaCheckCircle />
    },
    pausado: {
      label: 'Pausado',
      color: 'secondary',
      icon: <FaPauseCircle />
    },
    vencido: {
      label: 'Vencido',
      color: 'danger',
      icon: <FaTimesCircle />
    },
    proximo_vencer: {
      label: 'Próximo a Vencer',
      color: 'warning',
      icon: <FaExclamationCircle />
    }
  };

  const config = statusConfig[status] || {
    label: status,
    color: 'secondary',
    icon: <FaCircle />
  };

  const displayLabel = label || config.label;

  return (
    <span 
      className={`
        status-badge 
        status-badge--${config.color} 
        status-badge--${size}
        status-badge--${variant}
      `}
    >
      {showIcon && (
        <span className="status-badge-icon">
          {config.icon}
        </span>
      )}
      <span className="status-badge-label">{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;