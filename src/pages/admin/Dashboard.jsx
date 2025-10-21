import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../../components/dashboard/MetricCard';
import Card from '../../components/common/Card';
import { 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaUsers 
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import './Dashboard.scss';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Datos mock (luego conectar con API)
  const stats = {
    totalReportes: 1450,
    pendientes: 150,
    completados: 1200,
    usuariosActivos: 43
  };

  // Datos para gráficos
  const reportesMensuales = [
    { mes: 'ENE', reportes: 800 },
    { mes: 'FEB', reportes: 750 },
    { mes: 'MAR', reportes: 650 },
    { mes: 'ABR', reportes: 700 },
    { mes: 'MAY', reportes: 900 },
    { mes: 'JUN', reportes: 1050 },
    { mes: 'JUL', reportes: 1100 },
  ];

  const pieData = [
    { name: 'Completados', value: 91, color: '#10b981' },
    { name: 'Pendientes', value: 9, color: '#f59e0b' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-label">{label}</div>
          <div className="tooltip-value">Reportes: {payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general de actividad</p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="metrics-grid">
        <MetricCard
          title={<>Reportes<br />Validados</>}
          value={stats.completados}
          icon={<FaCheckCircle />}
          gradient="green"
        />

        <MetricCard
          title={<>Reportes<br />Pendientes</>}
          value={stats.pendientes}
          icon={<FaClock />}
          gradient="yellow"
        />

        <MetricCard
          title={<>Total<br />Reportes</>}
          value={stats.totalReportes}
          icon={<FaFileAlt />}
          gradient="orange"
        />

        <MetricCard
          title={<>Usuarios<br />Activos</>}
          value={stats.usuariosActivos}
          icon={<FaUsers />}
          gradient="blue"
        />
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Gráfico de líneas */}
        <Card title="Reportes Mensuales" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportesMensuales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="mes"
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="reportes"
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Gráfico de dona */}
        <Card title="Distribución de Reportes" className="chart-card donut-card">
          <div className="donut-container">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-info">
              <div className="donut-total">{stats.totalReportes}</div>
              <div className="donut-subtitle">REPORTES TOTALES</div>
              <div className="donut-legend">
                {pieData.map((entry) => (
                  <div key={entry.name} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;