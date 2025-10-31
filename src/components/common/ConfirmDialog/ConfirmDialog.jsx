import React from 'react';
import Modal from '../Modal';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import './ConfirmDialog.scss';

const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning', // warning, danger, success, info
  loading = false
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <FaTimesCircle className="confirm-icon confirm-icon--danger" />;
      case 'success':
        return <FaCheckCircle className="confirm-icon confirm-icon--success" />;
      case 'info':
        return <FaInfoCircle className="confirm-icon confirm-icon--info" />;
      default:
        return <FaExclamationTriangle className="confirm-icon confirm-icon--warning" />;
    }
  };

  const getConfirmVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      closeOnOverlayClick={!loading}
      closeOnEsc={!loading}
      showCloseButton={false}
    >
      <div className="confirm-dialog">
        <div className="confirm-dialog-icon">
          {getIcon()}
        </div>

        <h3 className="confirm-dialog-title">{title}</h3>

        {message && (
          <p className="confirm-dialog-message">{message}</p>
        )}

        <div className="confirm-dialog-actions">
          <Modal.Footer
            onCancel={onClose}
            onConfirm={onConfirm}
            cancelText={cancelText}
            confirmText={confirmText}
            confirmLoading={loading}
            confirmDisabled={loading}
            confirmVariant={getConfirmVariant()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;