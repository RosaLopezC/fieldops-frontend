import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from '../Button';
import './Modal.scss';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium',
  closeOnOverlayClick = true
}) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalClasses = [
    'modal__content',
    size === 'large' && 'modal__content--large',
    size === 'small' && 'modal__content--small'
  ].filter(Boolean).join(' ');

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button 
            className="modal__close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;