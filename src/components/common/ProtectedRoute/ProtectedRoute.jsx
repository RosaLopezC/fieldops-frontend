import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../../services/authService';
import BlockedScreen from '../BlockedScreen';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [checking, setChecking] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState(null);

  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    try {
      // Solo verificar si es Admin Local
      if (user && user.rol === 'admin') {
        const verificacion = await authService.verificarEstadoCuentaAdmin();
        
        if (verificacion.bloqueado) {
          setIsBlocked(true);
          setBlockInfo(verificacion);
        }
      }
    } catch (error) {
      console.error('Error al verificar cuenta:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:soporte@fieldops.com?subject=Renovación de Plan FieldOps';
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  // Mostrar loading mientras verifica
  if (checking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Verificando estado de cuenta...
      </div>
    );
  }

  // Mostrar pantalla de bloqueo si está bloqueado
  if (isBlocked) {
    return (
      <BlockedScreen
        verificacion={blockInfo}
        onContactSupport={handleContactSupport}
        onLogout={handleLogout}
      />
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Todo OK, mostrar contenido
  return children;
};

export default ProtectedRoute;