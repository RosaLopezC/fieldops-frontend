import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // ← Agregar useNavigate
import { 
  FaChartBar, 
  FaFileAlt, 
  FaMapMarkedAlt, 
  FaHeadset,
  FaChevronLeft,
  FaChevronRight 
} from 'react-icons/fa';
import './Sidebar.scss';

// ← AGREGAR collapsed y setCollapsed como props
const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation(); // ← AGREGAR ESTO
  const navigate = useNavigate(); // ← AGREGAR ESTO
  
  const menuItems = [
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

  const [openSubMenu, setOpenSubMenu] = React.useState('reportes');

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
                            // Si está colapsado, ir a la ruta por defecto
                            navigate(item.path);
                          } else {
                            // Si está expandido, toggle del submenu
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

      {/* Footer con botón de cerrar sesión */}
      {!collapsed && (
        <div className="sidebar-footer">
          <button className="sidebar-logout">
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;