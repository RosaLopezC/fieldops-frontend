import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import './ConfirmModal.scss';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning', // warning, danger, success, info
  loading = false
}) => {
  
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <FaTimesCircle className="icon-danger" />;
      case 'success':
        return <FaCheckCircle className="icon-success" />;
      case 'info':
        return <FaInfoCircle className="icon-info" />;
      default:
        return <FaExclamationTriangle className="icon-warning" />;
    }
  };

  const getVariantClass = () => {
    return `confirm-modal--${variant}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
    >
      <div className={`confirm-modal ${getVariantClass()}`}>
        <div className="confirm-modal__icon">
          {getIcon()}
        </div>
        
        <div className="confirm-modal__message">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
        
        <div className="confirm-modal__actions">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;