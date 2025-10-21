import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import superadminService from '../../services/superadminService';
import MetricCard from '../../components/dashboard/MetricCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { 
  FaBuilding, 
  FaUsers, 
  FaFileAlt,
  FaCheckCircle,
  FaEye,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import './Dashboard.scss';

const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_empresas: 0,
    empresas_activas: 0,
    total_usuarios: 0,
    total_reportes: 0,
    admins_activos: 0
  });
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, empresasRes] = await Promise.all([
        superadminService.getGlobalStats(),
        superadminService.getEmpresas()
      ]);
      
      setStats(statsRes.data);
      setEmpresas(empresasRes.data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmpresa = async (empresaId) => {
    try {
      await superadminService.toggleEmpresaEstado(empresaId);
      loadDashboardData();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Panel de Superadministrador</h1>
        <p>Vista global del sistema</p>
      </div>

      {/* Métricas globales */}
      <div className="metrics-grid">
        <MetricCard
          title={<>Total<br />Empresas</>}
          value={stats.total_empresas}
          icon={<FaBuilding />}
          gradient="blue"
          onClick={() => navigate('/superadmin/empresas')}
        />

        <MetricCard
          title={<>Empresas<br />Activas</>}
          value={stats.empresas_activas}
          icon={<FaCheckCircle />}
          gradient="green"
        />

        <MetricCard
          title={<>Total<br />Usuarios</>}
          value={stats.total_usuarios}
          icon={<FaUsers />}
          gradient="orange"
        />

        <MetricCard
          title={<>Total<br />Reportes</>}
          value={stats.total_reportes}
          icon={<FaFileAlt />}
          gradient="yellow"
        />
      </div>

      {/* Tabla de empresas */}
      <Card title="Empresas Registradas">
        <div className="empresas-table-container">
          <table className="empresas-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>RUC</th>
                <th>Admin Local</th>
                <th>Usuarios</th>
                <th>Reportes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>
                    <div className="empresa-info">
                      <strong>{empresa.nombre}</strong>
                      <span className="empresa-email">{empresa.email}</span>
                    </div>
                  </td>
                  <td>{empresa.ruc}</td>
                  <td>{empresa.admin_local}</td>
                  <td className="text-center">{empresa.usuarios_activos}</td>
                  <td className="text-center">{empresa.reportes_totales}</td>
                  <td>
                    <Badge 
                      variant={empresa.estado === 'activa' ? 'success' : 'secondary'}
                    >
                      {empresa.estado}
                    </Badge>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        size="small"
                        variant="outline"
                        icon={<FaEye />}
                        onClick={() => navigate(`/superadmin/empresas/${empresa.id}`)}
                      />
                      <Button
                        size="small"
                        variant={empresa.estado === 'activa' ? 'danger' : 'success'}
                        icon={empresa.estado === 'activa' ? <FaToggleOff /> : <FaToggleOn />}
                        onClick={() => handleToggleEmpresa(empresa.id)}
                      >
                        {empresa.estado === 'activa' ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SuperadminDashboard;