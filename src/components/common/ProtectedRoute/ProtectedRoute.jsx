import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../../services/authService';
import BlockedScreen from '../BlockedScreen';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [checking, setChecking] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState(null);

  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  // ✅ Memorizar para evitar loops
  const shouldCheck = useMemo(() => {
    return user && user.rol === 'admin' && user.empresa_id;
  }, [user?.rol, user?.empresa_id]);

  useEffect(() => {
    if (shouldCheck) {
      checkAccountStatus();
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line
  }, [shouldCheck]);

  const checkAccountStatus = async () => {
    try {
      // Solo verificar si es Admin Local
      if (user && user.rol === 'admin') {
        console.log('✅ Verificando estado de cuenta para admin...');
        console.log('🏢 Empresa ID:', user.empresa_id);
        
        const verificacion = await authService.verificarEstadoCuentaAdmin();
        
        console.log('📊 Resultado verificación:', verificacion);
        
        if (verificacion.bloqueado) {
          console.log('❌ CUENTA BLOQUEADA:', verificacion.tipo);
          setIsBlocked(true);
          setBlockInfo(verificacion);
        } else {
          console.log('✅ Cuenta activa - Acceso permitido');
        }
      } else {
        console.log('ℹ️ Usuario no es admin, saltando verificación');
      }
    } catch (error) {
      console.error('❌ Error al verificar cuenta:', error);
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