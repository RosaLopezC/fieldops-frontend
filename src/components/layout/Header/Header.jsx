import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import NotificationDropdown from '../../common/NotificationDropdown';
import NotificationBell from '../../common/NotificationBell';
import { FaChevronDown, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import './Header.scss';

const Header = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres?.charAt(0) || '';
    const lastInitial = apellidos?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Mapear rol del usuario para las notificaciones
  const getNotificationRole = () => {
    if (user?.rol === 'supervisor') return 'supervisor';
    if (user?.rol === 'encargado') return 'encargado';
    return null;
  };

  const notificationRole = getNotificationRole();

  return (
    <header className={`app-header ${collapsed ? 'app-header--expanded' : ''}`}>
      <div className="header-content">
        <div className="header-left"></div>

        <div className="header-right">
          {/* Notificaciones - solo para supervisor y encargado */}
          {notificationRole && (
            <NotificationDropdown role={notificationRole} />
          )}
          
          {/* NotificationBell - solo para admin con alertas de plan */}
          {user?.rol === 'admin' && (
            <NotificationBell />
          )}

          <div className="user-menu">
            <button 
              className="user-menu-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar">
                {getInitials(user?.nombres, user?.apellidos)}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.nombres || 'Usuario'}</span>
                <span className="user-dni">DNI: {user?.dni}</span>
              </div>
              <FaChevronDown className="dropdown-icon" />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-name">{user?.nombres} {user?.apellidos}</p>
                  <p className="dropdown-email">{user?.email}</p>
                </div>
                <hr />
                
                {/* Botón de Perfil */}
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    navigate('/perfil');
                    setDropdownOpen(false);
                  }}
                >
                  <FaUser />
                  Mi Perfil
                </button>
                
                {/* Configuración solo para admin y superadmin */}
                {(user?.rol === 'admin' || user?.rol === 'superadmin') && (
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      navigate('/admin/configuracion');
                      setDropdownOpen(false);
                    }}
                  >
                    <FaCog />
                    Configuración
                  </button>
                )}
                
                <hr />
                
                <button className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;