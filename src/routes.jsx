import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import { ROLES } from './config/roles';
import Button from './components/common/Button';
import { FaSignOutAlt, FaTools } from 'react-icons/fa';

// Páginas de autenticación
import Login from './pages/auth/Login';
import Unauthorized from './pages/auth/Unauthorized';

// Páginas del Supervisor
import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorReports from './pages/supervisor/Reports';

// Componente temporal para roles sin desarrollar
const ComingSoonPage = ({ role }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
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
      <FaTools size={80} color="#FF6B35" />
      
      <div>
        <h1 style={{ fontSize: '36px', color: '#005B9A', margin: '0 0 10px 0' }}>
          {role} - En Desarrollo
        </h1>
        <p style={{ color: '#6c757d', fontSize: '18px', marginBottom: '10px' }}>
          Bienvenido, {user?.nombres} {user?.apellidos}
        </p>
        <p style={{ color: '#6c757d', maxWidth: '500px' }}>
          Esta sección está en desarrollo y estará disponible próximamente.
        </p>
      </div>

      <Button variant="danger" icon={<FaSignOutAlt />} onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading, getDefaultRoute } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #FF6B35',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6c757d' }}>Cargando...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />
          } 
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas del SUPERVISOR con Layout */}
        <Route
          path="/supervisor"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="reportes" element={<SupervisorReports />} />
          <Route path="reportes/postes" element={<SupervisorReports />} />
          <Route path="reportes/predios" element={<SupervisorReports />} />
          <Route path="soporte" element={<ComingSoonPage role="Soporte" />} />
          <Route path="" element={<Navigate to="dashboard" replace />} /> {/* ← CAMBIAR de reportes a dashboard */}
        </Route>

        {/* Rutas del ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ADMIN_LOCAL]}>
              <ComingSoonPage role="Administrador Local" />
            </ProtectedRoute>
          }
        />

        {/* Rutas del SUPERADMIN */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
              <ComingSoonPage role="Superadministrador" />
            </ProtectedRoute>
          }
        />

        {/* Rutas del ENCARGADO */}
        <Route
          path="/encargado"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ENCARGADO]}>
              <ComingSoonPage role="Encargado (Móvil)" />
            </ProtectedRoute>
          }
        />

        {/* Redirección raíz */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={getDefaultRoute()} replace />
              : <Navigate to="/login" replace />
          } 
        />

        {/* Ruta 404 */}
        <Route 
          path="*" 
          element={
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <h1 style={{ fontSize: '72px', color: '#6c757d' }}>404</h1>
              <p style={{ color: '#6c757d' }}>Página no encontrada</p>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;