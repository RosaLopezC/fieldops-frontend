import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { 
  FaChartBar, 
  FaChartLine, // ← AGREGAR
  FaFileAlt, 
  FaUsers,
  FaMapMarkedAlt, 
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaBuilding,
  FaClipboardList
} from 'react-icons/fa';
import { ROLES } from '../../../config/roles';
import './Sidebar.scss';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openSubMenu, setOpenSubMenu] = useState('reportes');

  // Menús según rol
  const getMenuItems = () => {
    // SUPERADMIN
    if (user?.rol === ROLES.SUPERADMIN) {
      return [
        {
          section: 'ADMINISTRACIÓN',
          items: [
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: FaChartBar,
              path: '/superadmin/dashboard'
            },
            {
              id: 'empresas',
              label: 'Empresas',
              icon: FaBuilding,
              path: '/superadmin/empresas'
            },
            {
              id: 'admins',
              label: 'Admins Locales',
              icon: FaUsers,
              path: '/superadmin/admins'
            },
            {
              id: 'logs',
              label: 'Logs de Auditoría',
              icon: FaClipboardList,
              path: '/superadmin/logs'
            }
          ]
        }
      ];
    }

    // SUPERVISOR
    if (user?.rol === ROLES.SUPERVISOR) {
      return [
        {
          section: 'ACCIONES',
          items: [
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: FaChartBar,
              path: '/supervisor/dashboard'
            },
            {
              id: 'reportes',
              label: 'Reportes',
              icon: FaFileAlt,
              path: '/supervisor/reportes',
              subItems: [
                { id: 'todos', label: 'Todos', path: '/supervisor/reportes' },
                { id: 'postes', label: 'Postes', path: '/supervisor/reportes/postes' },
                { id: 'predios', label: 'Predios', path: '/supervisor/reportes/predios' },
              ]
            }
          ]
        },
        {
          section: 'SOPORTE',
          items: [
            {
              id: 'soporte',
              label: 'Soporte',
              icon: FaHeadset,
              path: '/supervisor/soporte'
            }
          ]
        }
      ];
    }

    // ADMIN
    if (user?.rol === ROLES.ADMIN || user?.rol === ROLES.ADMIN_LOCAL) {
      const adminMenuItems = [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: FaChartLine,
          path: '/admin/dashboard'
        },
        {
          id: 'usuarios',
          label: 'Usuarios',
          icon: FaUsers,
          path: '/admin/usuarios',
          subItems: [
            { id: 'supervisores', label: 'Supervisores', path: '/admin/usuarios/supervisores' },
            { id: 'encargados', label: 'Encargados', path: '/admin/usuarios/encargados' }
          ]
        },
        {
          id: 'reportes',
          label: 'Reportes',
          icon: FaFileAlt,
          path: '/admin/reportes'
        },
        {
          id: 'configuracion',
          label: 'Configuración',
          icon: FaCog,
          path: '/admin/configuracion'
        }
      ];

      return [
        {
          section: 'ACCIONES',
          items: adminMenuItems
        }
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const toggleSubMenu = (id) => {
    setOpenSubMenu(openSubMenu === id ? null : id);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/src/assets/images/logo.png" alt="FieldOps" />
      </div>

      {/* Toggle collapse button */}
      <button 
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            {!collapsed && (
              <div className="sidebar-section-title">{section.section}</div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openSubMenu === item.id;

              return (
                <div key={item.id} className="sidebar-menu-item">
                  {hasSubItems ? (
                    <>
                      <button
                        className={`sidebar-link ${
                          item.subItems?.some(sub => location.pathname === sub.path) 
                            ? 'active' 
                            : ''
                        }`}
                        onClick={() => {
                          if (collapsed) {
                            navigate(item.path);
                          } else {
                            toggleSubMenu(item.id);
                          }
                        }}
                      >
                        <Icon className="sidebar-icon" />
                        {!collapsed && (
                          <>
                            <span className="sidebar-label">{item.label}</span>
                            <FaChevronRight 
                              className={`sidebar-arrow ${isOpen ? 'open' : ''}`}
                            />
                          </>
                        )}
                      </button>

                      {isOpen && !collapsed && (
                        <div className="sidebar-submenu">
                          {item.subItems.map((subItem) => (
                            <NavLink
                              key={subItem.id}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `sidebar-sublink ${isActive ? 'active' : ''}`
                              }
                              end={subItem.id === 'todos'}
                            >
                              <span className="sidebar-dot"></span>
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                      }
                    >
                      <Icon className="sidebar-icon" />
                      {!collapsed && (
                        <span className="sidebar-label">{item.label}</span>
                      )}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;