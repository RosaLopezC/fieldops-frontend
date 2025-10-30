import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaExclamationTriangle, FaCalendarAlt, FaDatabase, FaTimes } from 'react-icons/fa';
import Badge from '../Badge';
import authService from '../../../services/authService';
import './NotificationBell.scss';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (user && user.rol === 'admin') {
      loadNotifications();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const verificacion = await authService.verificarEstadoCuentaAdmin();
      
      if (verificacion.alertas && verificacion.alertas.length > 0) {
        const notifs = verificacion.alertas.map((alerta, index) => ({
          id: index + 1,
          tipo: alerta.tipo,
          nivel: alerta.nivel,
          mensaje: alerta.mensaje,
          leida: false,
          fecha: new Date().toISOString()
        }));
        
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.leida).length);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
    
    if (!showDropdown) {
      // Marcar como leídas al abrir
      setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
      setUnreadCount(0);
    }
  };

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'PROXIMO_VENCER':
        return <FaCalendarAlt className="notif-icon notif-icon--warning" />;
      case 'STORAGE_EXTRA':
        return <FaDatabase className="notif-icon notif-icon--info" />;
      default:
        return <FaExclamationTriangle className="notif-icon notif-icon--warning" />;
    }
  };

  if (user?.rol !== 'admin' || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className="notification-bell__button"
        onClick={handleToggleDropdown}
        aria-label="Notificaciones"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-bell__badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-bell__dropdown">
          <div className="notification-bell__header">
            <h4>Notificaciones</h4>
            <Badge variant="info">{notifications.length}</Badge>
          </div>

          <div className="notification-bell__list">
            {notifications.map(notif => (
              <div 
                key={notif.id}
                className={`notification-item notification-item--${notif.nivel}`}
              >
                <div className="notification-item__icon">
                  {getIcon(notif.tipo)}
                </div>
                <div className="notification-item__content">
                  <p>{notif.mensaje}</p>
                </div>
                <button
                  className="notification-item__dismiss"
                  onClick={() => handleDismiss(notif.id)}
                  aria-label="Descartar"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <div className="notification-bell__footer">
            <button onClick={() => setShowDropdown(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;