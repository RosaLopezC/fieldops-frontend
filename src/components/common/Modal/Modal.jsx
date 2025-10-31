import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import Button from '../Button';
import './Modal.scss';

const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'medium', // small, medium, large, xlarge
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = ''
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    // Manejar tecla ESC
    const handleEsc = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container modal-container--${size} ${className}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {showCloseButton && (
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Componente auxiliar para footer con botones estándar
Modal.Footer = ({
  onCancel,
  onConfirm,
  cancelText = 'Cancelar',
  confirmText = 'Guardar',
  confirmLoading = false,
  confirmDisabled = false,
  confirmVariant = 'primary'
}) => (
  <div className="modal-footer-actions">
    <Button
      variant="outline"
      onClick={onCancel}
      disabled={confirmLoading}
    >
      {cancelText}
    </Button>
    <Button
      variant={confirmVariant}
      onClick={onConfirm}
      loading={confirmLoading}
      disabled={confirmDisabled}
    >
      {confirmText}
    </Button>
  </div>
);

export default Modal;