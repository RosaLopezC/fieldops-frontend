import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/reportService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaEye 
} from 'react-icons/fa';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import './Dashboard.scss';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    completados: 0,
    observados: 0,
    registrados: 0
  });
  const [reportsByZone, setReportsByZone] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const reports = await reportService.getReports();

      // Calcular estadísticas
      const statsData = {
        total: reports.length,
        pendientes: reports.filter(r => r.estado === 'pendiente').length,
        completados: reports.filter(r => r.estado === 'completado').length,
        observados: reports.filter(r => r.estado === 'observado').length,
        registrados: reports.filter(r => r.estado === 'registrado').length
      };
      setStats(statsData);

      // Agrupar por zona
      const zoneData = reports.reduce((acc, report) => {
        const zone = report.zona || 'Sin zona';
        if (!acc[zone]) {
          acc[zone] = 0;
        }
        acc[zone]++;
        return acc;
      }, {});

      const zoneArray = Object.entries(zoneData).map(([zona, cantidad]) => ({
        zona,
        cantidad
      }));
      setReportsByZone(zoneArray);

      // Últimos 5 reportes
      const recent = reports.slice(0, 5);
      setRecentReports(recent);

    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos para el gráfico de dona
  const pieData = [
    { name: 'Pendientes', value: stats.pendientes, color: '#FFC107' },
    { name: 'Completados', value: stats.completados, color: '#28a745' },
    { name: 'Observados', value: stats.observados, color: '#dc3545' },
    { name: 'Registrados', value: stats.registrados, color: '#17a2b8' }
  ];

  const handleViewReport = (reportId) => {
    navigate(`/supervisor/reportes?id=${reportId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="supervisor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general de reportes</p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="metrics-grid">
        <Card className="metric-card metric-card--total">
          <div className="metric-icon">
            <FaFileAlt />
          </div>
          <div className="metric-content">
            <h3>{stats.total}</h3>
            <p>Total Reportes</p>
          </div>
        </Card>

        <Card className="metric-card metric-card--pending">
          <div className="metric-icon">
            <FaClock />
          </div>
          <div className="metric-content">
            <h3>{stats.pendientes}</h3>
            <p>Pendientes</p>
          </div>
        </Card>

        <Card className="metric-card metric-card--completed">
          <div className="metric-icon">
            <FaCheckCircle />
          </div>
          <div className="metric-content">
            <h3>{stats.completados}</h3>
            <p>Completados</p>
          </div>
        </Card>

        <Card className="metric-card metric-card--observed">
          <div className="metric-icon">
            <FaExclamationTriangle />
          </div>
          <div className="metric-content">
            <h3>{stats.observados}</h3>
            <p>Observados</p>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Gráfico de dona */}
        <Card title="Distribución por Estado">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gráfico de barras */}
        <Card title="Reportes por Zona">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsByZone}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zona" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#005B9A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card title="Actividad Reciente">
        <div className="recent-activity">
          {recentReports.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6c757d' }}>
              No hay actividad reciente
            </p>
          ) : (
            <table className="activity-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Encargado</th>
                  <th>Zona</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.tipo}</td>
                    <td>{report.encargado_nombre}</td>
                    <td>{report.zona}</td>
                    <td>
                      <Badge 
                        variant={
                          report.estado === 'completado' ? 'success' :
                          report.estado === 'pendiente' ? 'warning' :
                          report.estado === 'observado' ? 'danger' : 'info'
                        }
                      >
                        {report.estado}
                      </Badge>
                    </td>
                    <td>{report.fecha_reporte}</td>
                    <td>
                      <Button
                        size="small"
                        variant="outline"
                        icon={<FaEye />}
                        onClick={() => handleViewReport(report.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SupervisorDashboard;