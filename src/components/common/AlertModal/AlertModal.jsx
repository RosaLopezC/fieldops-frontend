import React, { useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import './AlertModal.scss';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title,
  message,
  variant = 'success', // success, error, warning, info
  autoClose = true,
  autoCloseDelay = 2000
}) => {
  
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <FaCheckCircle className="icon-success" />;
      case 'error':
        return <FaTimesCircle className="icon-error" />;
      case 'warning':
        return <FaExclamationTriangle className="icon-warning" />;
      case 'info':
        return <FaInfoCircle className="icon-info" />;
      default:
        return <FaCheckCircle className="icon-success" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (variant) {
      case 'success':
        return '✓ Operación Exitosa';
      case 'error':
        return '✗ Error';
      case 'warning':
        return '⚠ Advertencia';
      case 'info':
        return 'ℹ Información';
      default:
        return 'Notificación';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="small"
    >
      <div className={`alert-modal alert-modal--${variant}`}>
        <div className="alert-modal__icon">
          {getIcon()}
        </div>
        
        <div className="alert-modal__message">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
        
        {!autoClose && (
          <div className="alert-modal__actions">
            <Button
              variant="primary"
              onClick={onClose}
              fullWidth
            >
              Aceptar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AlertModal;