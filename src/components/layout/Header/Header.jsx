import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { FaBell, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Header.scss';

const Header = ({ collapsed }) => { // ← AGREGAR collapsed como prop
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

  return (
    <header className={`app-header ${collapsed ? 'app-header--expanded' : ''}`}>
      {/* ↑ AGREGAR la clase condicional */}
      <div className="header-content">
        <div className="header-left"></div>

        <div className="header-right">
          <button className="header-icon-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu">
            <button 
              className="user-menu-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="user-avatar">
                {getInitials(user?.nombres, user?.apellidos)}
              </div>
              <div className="user-info">
                <span className="user-name">Userprueba</span>
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