import React from 'react';
import { FaLock, FaExclamationTriangle, FaDatabase, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import Button from '../Button';
import './BlockedScreen.scss';

const BlockedScreen = ({ verificacion, onContactSupport, onLogout }) => {
  const { tipo, mensaje, datos } = verificacion;

  const getIcon = () => {
    switch (tipo) {
      case 'VENCIDO':
        return <FaCalendarAlt className="blocked-icon blocked-icon--expired" />;
      case 'STORAGE_EXCEDIDO':
        return <FaDatabase className="blocked-icon blocked-icon--storage" />;
      default:
        return <FaLock className="blocked-icon blocked-icon--default" />;
    }
  };

  const getTitle = () => {
    switch (tipo) {
      case 'VENCIDO':
        return '📅 Tu Plan ha Vencido';
      case 'STORAGE_EXCEDIDO':
        return '💾 Almacenamiento Excedido';
      default:
        return '🔒 Acceso Bloqueado';
    }
  };

  return (
    <div className="blocked-screen">
      <div className="blocked-screen__content">
        <div className="blocked-screen__logo">
          <img src="/logo.svg" alt="FieldOps" onError={(e) => e.target.style.display = 'none'} />
          <h1>FieldOps</h1>
        </div>

        <div className="blocked-screen__icon">
          {getIcon()}
        </div>

        <h2 className="blocked-screen__title">{getTitle()}</h2>
        
        <div className="blocked-screen__message">
          <p>{mensaje}</p>
        </div>

        {datos && (
          <div className="blocked-screen__details">
            {tipo === 'VENCIDO' && (
              <>
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>Tu plan venció hace <strong>{datos.dias_vencido} días</strong></span>
                </div>
                <div className="detail-item">
                  <FaExclamationTriangle />
                  <span>Fecha de vencimiento: <strong>{datos.fecha_vencimiento}</strong></span>
                </div>
              </>
            )}
            
            {tipo === 'STORAGE_EXCEDIDO' && (
              <>
                <div className="detail-item">
                  <FaDatabase />
                  <span>Has excedido <strong>{datos.storage_extra.toFixed(1)} GB</strong></span>
                </div>
                <div className="detail-item">
                  <FaExclamationTriangle />
                  <span>Costo pendiente: <strong>S/. {datos.costo_extra.toFixed(2)}</strong></span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="blocked-screen__info">
          <h3>¿Cómo resolver esto?</h3>
          <ul>
            <li>Contacta con el equipo de FieldOps para renovar tu plan</li>
            <li>Realiza el pago correspondiente</li>
            <li>Tu acceso se reactivará automáticamente</li>
          </ul>
        </div>

        <div className="blocked-screen__contact">
          <h4>📞 Información de Contacto</h4>
          <p><FaEnvelope /> <strong>soporte@fieldops.com</strong></p>
          <p>📱 <strong>+51 987 654 321</strong></p>
        </div>

        <div className="blocked-screen__actions">
          <Button
            variant="primary"
            onClick={onContactSupport}
            icon={<FaEnvelope />}
          >
            Contactar Soporte
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockedScreen;