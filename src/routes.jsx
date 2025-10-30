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
import Unauthorized from './pages/Unauthorized';

// Páginas del Supervisor
import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorReports from './pages/supervisor/Reports';
import Support from './pages/supervisor/Support';

// Páginas del Admin
import { 
  AdminDashboard, 
  AdminSupervisores, 
  AdminEncargados,
  AdminReportes,
  MisDistritos,
  MisZonas,
  MisSectores,
  MapaInteractivo // ← AGREGAR
} from './pages/admin';

// Páginas del Superadmin
import SuperadminDashboard from './pages/superadmin/Dashboard';
import Empresas from './pages/superadmin/Empresas';
import AdminsLocales from './pages/superadmin/AdminsLocales';
import Logs from './pages/superadmin/Logs';
import Perfil from './pages/Perfil'; // ← AGREGAR ESTA LÍNEA

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
        {/* Ruta de acceso denegado - sin Layout */}
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
          <Route path="soporte" element={<Support />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rutas del ADMIN con Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ADMIN_LOCAL]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="usuarios/supervisores" element={<AdminSupervisores />} />
          <Route path="usuarios/encargados" element={<AdminEncargados />} />
          <Route path="territorial/distritos" element={<MisDistritos />} />
          <Route path="territorial/zonas" element={<MisZonas />} />
          <Route path="territorial/sectores" element={<MisSectores />} />
          <Route path="territorial/mapa" element={<MapaInteractivo />} /> {/* ← CAMBIAR */}
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="configuracion" element={<ComingSoonPage role="Configuración" />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rutas del SUPERADMIN con Layout */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SuperadminDashboard />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="empresas/:id" element={<ComingSoonPage role="Detalle Empresa" />} />
          <Route path="admins" element={<AdminsLocales />} />
          <Route path="admins-locales" element={<AdminsLocales />} /> {/* ← AGREGADO */}
          <Route path="logs" element={<Logs />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Rutas del ENCARGADO */}
        <Route
          path="/encargado"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ENCARGADO]}>
              <ComingSoonPage role="Encargado (Móvil)" />
            </ProtectedRoute>
          }
        />

        {/* Ruta de Perfil - accesible para todos los roles */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={[
              ROLES.SUPERADMIN,
              ROLES.ADMIN,
              ROLES.ADMIN_LOCAL,
              ROLES.SUPERVISOR,
              ROLES.ENCARGADO
            ]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Perfil />} />
        </Route>

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