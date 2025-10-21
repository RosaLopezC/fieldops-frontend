import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../../services/notificationService';
import { 
  FaBell,
  FaFileAlt,
  FaEdit,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaCheck,
  FaCheckDouble
} from 'react-icons/fa';
import './NotificationDropdown.scss';

const NotificationDropdown = ({ role }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [role]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(role);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount(role);
      setUnreadCount(response.data);
    } catch (error) {
      console.error('Error al cargar contador:', error);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId, role);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(role);
      loadNotifications();
      loadUnreadCount();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.leido) {
      handleMarkAsRead(notification.id, { stopPropagation: () => {} });
    }
    if (notification.url) {
      navigate(notification.url);
    }
    setIsOpen(false);
  };

  const getIcon = (iconName) => {
    const icons = {
      FaFileAlt,
      FaEdit,
      FaClock,
      FaCheckCircle,
      FaExclamationTriangle,
      FaMapMarkedAlt
    };
    const Icon = icons[iconName] || FaBell;
    return <Icon />;
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button className="notification-btn" onClick={handleToggle}>
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-btn"
                onClick={handleMarkAllAsRead}
                title="Marcar todas como leídas"
              >
                <FaCheckDouble />
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <p>Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <FaBell className="empty-icon" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.leido ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`notification-icon notification-icon--${notification.color}`}>
                    {getIcon(notification.icono)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.titulo}</div>
                    <div className="notification-message">{notification.mensaje}</div>
                    <div className="notification-time">{notification.timeAgo}</div>
                  </div>
                  {!notification.leido && (
                    <button
                      className="mark-read-btn"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      title="Marcar como leída"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;