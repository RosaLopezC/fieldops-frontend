import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario, verificar si hay token
  const token = localStorage.getItem('accessToken');
  
  if (!user && !token) {
    // No hay usuario ni token, redirigir al login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay token pero no usuario, esperar a que useAuth lo cargue
  if (token && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // Verificar roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    // Usuario no tiene permiso, redirigir al login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Usuario autenticado y autorizado
  return children;
};

export default ProtectedRoute;