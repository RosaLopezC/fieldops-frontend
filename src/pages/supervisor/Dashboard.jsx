import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { FaSignOutAlt } from 'react-icons/fa';

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: '40px' }}>
      {/* Header temporal con botón de logout */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#005B9A', marginBottom: '10px' }}>
            Dashboard - Supervisor
          </h1>
          <p style={{ color: '#6c757d', margin: 0 }}>
            Bienvenido, {user?.nombres} {user?.apellidos}
          </p>
        </div>

        <Button 
          variant="danger" 
          icon={<FaSignOutAlt />}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <Card title="Reportes Pendientes" hoverable>
          <h2 style={{ fontSize: '48px', color: '#ffc107', margin: '20px 0' }}>
            25
          </h2>
          <Badge variant="warning" dot>Requieren revisión</Badge>
        </Card>

        <Card title="Reportes Validados" hoverable>
          <h2 style={{ fontSize: '48px', color: '#28a745', margin: '20px 0' }}>
            150
          </h2>
          <Badge variant="success" dot>Este mes</Badge>
        </Card>

        <Card title="Reportes Observados" hoverable>
          <h2 style={{ fontSize: '48px', color: '#dc3545', margin: '20px 0' }}>
            5
          </h2>
          <Badge variant="danger" dot>Necesitan corrección</Badge>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorDashboard;