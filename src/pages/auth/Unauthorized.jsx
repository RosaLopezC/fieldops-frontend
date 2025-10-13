import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { getDefaultRoute, logout } = useAuth();

  const handleGoBack = () => {
    const defaultRoute = getDefaultRoute();
    navigate(defaultRoute, { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '30px',
      padding: '20px',
      textAlign: 'center'
    }}>
      <FaExclamationTriangle size={80} color="#ffc107" />
      
      <div>
        <h1 style={{ fontSize: '48px', color: '#2c3e50', margin: '0 0 10px 0' }}>
          403
        </h1>
        <h2 style={{ fontSize: '24px', color: '#6c757d', margin: '0 0 20px 0' }}>
          Acceso No Autorizado
        </h2>
        <p style={{ color: '#6c757d', maxWidth: '500px' }}>
          No tienes permisos para acceder a esta sección del sistema.
          Por favor, contacta con tu administrador si crees que esto es un error.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Button variant="primary" onClick={handleGoBack}>
          Volver al Inicio
        </Button>
        <Button variant="outline" onClick={logout}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;