import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ReporteDetailModal from '../../components/admin/ReporteDetailModal';
import useAuth from '../../hooks/useAuth';
import {
  FaClipboardList,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarDay,
  FaEye,
  FaMapMarkedAlt,
  FaChartLine,
  FaUsers
} from 'react-icons/fa';
import './Dashboard.scss';

// MOCK DATA - Reportes pendientes del supervisor
const mockReportesPendientes = [
  {
    id: 1,
    tipo: 'Poste Eléctrico',
    fecha: '2025-01-31',
    hora: '09:30:00',
    encargado: 'Carlos Ramírez',
    zona: 'Lima Norte',
    sector: 'Sector A1',
    estado: 'pendiente',
    gps: { lat: -12.0464, lng: -77.0428, precision: 5 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista frontal' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista lateral' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Detalle' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Código' }
    ],
    datos: {
      'Material': 'Concreto',
      'Altura': '12 metros',
      'Estado': 'Bueno',
      'Propietario': 'Luz del Sur'
    },
    observaciones: 'Estructura en buen estado',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Carlos Ramírez',
        fecha: '2025-01-31 09:30'
      }
    ]
  },
  {
    id: 5,
    tipo: 'Poste Telemático',
    fecha: '2025-01-31',
    hora: '11:15:00',
    encargado: 'Lucía Mendoza',
    zona: 'Lima Norte',
    sector: 'Sector A2',
    estado: 'pendiente',
    gps: { lat: -12.0500, lng: -77.0450, precision: 4 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'General' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Cables' }
    ],
    datos: {
      'Material': 'Metálico',
      'Altura': '15 metros',
      'Estado': 'Excelente'
    },
    observaciones: null,
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Lucía Mendoza',
        fecha: '2025-01-31 11:15'
      }
    ]
  },
  {
    id: 6,
    tipo: 'Poste Eléctrico',
    fecha: '2025-01-31',
    hora: '14:00:00',
    encargado: 'Roberto Quispe',
    zona: 'Lima Norte',
    sector: 'Sector A1',
    estado: 'pendiente',
    gps: { lat: -12.0480, lng: -77.0440, precision: 7 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista frontal' }
    ],
    datos: {
      'Material': 'Madera',
      'Altura': '10 metros',
      'Estado': 'Regular'
    },
    observaciones: 'Poste con ligera inclinación',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Roberto Quispe',
        fecha: '2025-01-31 14:00'
      }
    ]
  }
];

// MOCK DATA - Estadísticas
const mockEstadisticas = {
  pendientes: 3,
  aprobados_hoy: 5,
  observados: 2,
  total_hoy: 8,
  encargados_activos: 3,
  sectores_asignados: 2
};

// MOCK DATA - Actividad semanal
const actividadSemanal = [
  { dia: 'Lun', reportes: 8 },
  { dia: 'Mar', reportes: 12 },
  { dia: 'Mié', reportes: 10 },
  { dia: 'Jue', reportes: 15 },
  { dia: 'Vie', reportes: 8 },
  { dia: 'Sáb', reportes: 3 },
  { dia: 'Dom', reportes: 0 }
];

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [reportes, setReportes] = useState(mockReportesPendientes);
  const [stats, setStats] = useState(mockEstadisticas);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '70px',
      render: (value) => `#${value}`
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span style={{
          fontWeight: 600,
          color: value === 'Poste Eléctrico' ? '#0066cc' : '#FF6B35'
        }}>
          {value}
        </span>
      )
    },
    {
      key: 'hora',
      label: 'Hora',
      width: '90px'
    },
    {
      key: 'encargado',
      label: 'Encargado',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{row.sector}</div>
        </div>
      )
    },
    {
      key: 'gps',
      label: 'GPS',
      width: '80px',
      render: (value) => (
        <span style={{
          color: value.precision <= 5 ? '#28a745' : '#ffc107',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          ±{value.precision}m
        </span>
      )
    }
  ];

  const renderActions = (reporte) => (
    <div className="table-actions">
      <Button
        variant="primary"
        size="small"
        leftIcon={<FaEye />}
        onClick={() => handleViewDetail(reporte)}
      >
        Validar
      </Button>
    </div>
  );

  const handleViewDetail = (reporte) => {
    setSelectedReporte(reporte);
    setIsDetailModalOpen(true);
  };

  const handleAprobar = (reporteId) => {
    setReportes(prev => prev.filter(r => r.id !== reporteId));
    setStats(prev => ({
      ...prev,
      pendientes: prev.pendientes - 1,
      aprobados_hoy: prev.aprobados_hoy + 1
    }));
    alert('✅ Reporte aprobado exitosamente');
  };

  const handleRechazar = (reporteId) => {
    setReportes(prev => prev.filter(r => r.id !== reporteId));
    setStats(prev => ({
      ...prev,
      pendientes: prev.pendientes - 1
    }));
    alert('✅ Reporte rechazado exitosamente');
  };

  const handleObservar = (reporteId, observacion) => {
    setReportes(prev => prev.filter(r => r.id !== reporteId));
    setStats(prev => ({
      ...prev,
      pendientes: prev.pendientes - 1,
      observados: prev.observados + 1
    }));
    alert('✅ Reporte observado exitosamente');
  };

  const maxReportes = Math.max(...actividadSemanal.map(d => d.reportes));

  return (
    <div className="supervisor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Supervisor</h1>
          <p className="subtitle">
            Bienvenido, <strong>{user.nombres} {user.apellidos}</strong>
          </p>
        </div>
        <div className="header-date">
          <FaCalendarDay />
          <span>{new Date().toLocaleDateString('es-PE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        <Card className="metric-card metric-card--warning">
          <div className="metric-icon">
            <FaClipboardList />
          </div>
          <div className="metric-content">
            <span className="metric-label">Pendientes</span>
            <span className="metric-value">{stats.pendientes}</span>
            <span className="metric-description">Por validar</span>
          </div>
        </Card>

        <Card className="metric-card metric-card--success">
          <div className="metric-icon">
            <FaCheckCircle />
          </div>
          <div className="metric-content">
            <span className="metric-label">Aprobados Hoy</span>
            <span className="metric-value">{stats.aprobados_hoy}</span>
            <span className="metric-description">Reportes validados</span>
          </div>
        </Card>

        <Card className="metric-card metric-card--info">
          <div className="metric-icon">
            <FaExclamationCircle />
          </div>
          <div className="metric-content">
            <span className="metric-label">Observados</span>
            <span className="metric-value">{stats.observados}</span>
            <span className="metric-description">Requieren corrección</span>
          </div>
        </Card>

        <Card className="metric-card metric-card--primary">
          <div className="metric-icon">
            <FaCalendarDay />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Hoy</span>
            <span className="metric-value">{stats.total_hoy}</span>
            <span className="metric-description">Reportes recibidos</span>
          </div>
        </Card>
      </div>

      {/* Contenido Principal */}
      <div className="dashboard-content">
        {/* Columna Izquierda */}
        <div className="content-left">
          {/* Reportes Pendientes */}
          <Card>
            <div className="card-header">
              <h2>Reportes Pendientes de Validación</h2>
              <StatusBadge status="pendiente" />
            </div>
            <Table
              columns={columns}
              data={reportes}
              actions={renderActions}
              emptyMessage="¡Excelente! No hay reportes pendientes"
              pagination={false}
            />
          </Card>

          {/* Gráfico de Actividad */}
          <Card>
            <div className="card-header">
              <h2>Actividad de la Semana</h2>
              <FaChartLine style={{ color: '#0066cc' }} />
            </div>
            <div className="activity-chart">
              {actividadSemanal.map((dia, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: dia.reportes > 0 ? `${(dia.reportes / maxReportes) * 100}%` : '4px'
                      }}
                    >
                      <span className="bar-value">{dia.reportes}</span>
                    </div>
                  </div>
                  <span className="bar-label">{dia.dia}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Columna Derecha */}
        <div className="content-right">
          {/* Equipo */}
          <Card>
            <div className="card-header">
              <h2>Mi Equipo</h2>
              <FaUsers style={{ color: '#0066cc' }} />
            </div>
            <div className="team-info">
              <div className="info-item">
                <span className="info-label">Encargados Activos</span>
                <span className="info-value">{stats.encargados_activos}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sectores Asignados</span>
                <span className="info-value">{stats.sectores_asignados}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Zona</span>
                <span className="info-value">Lima Norte</span>
              </div>
            </div>
          </Card>

          {/* Mapa Rápido */}
          <Card>
            <div className="card-header">
              <h2>Ubicaciones Recientes</h2>
              <FaMapMarkedAlt style={{ color: '#0066cc' }} />
            </div>
            <div className="quick-map">
              <iframe
                src="https://www.google.com/maps?q=-12.0464,-77.0428&z=13&output=embed"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicaciones"
              ></iframe>
            </div>
            <Button
              variant="outline"
              className="map-button"
              leftIcon={<FaMapMarkedAlt />}
              onClick={() => window.open('https://www.google.com/maps', '_blank')}
            >
              Ver Mapa Completo
            </Button>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <div className="card-header">
              <h2>Acciones Rápidas</h2>
            </div>
            <div className="quick-actions">
              <Button 
                variant="primary" 
                className="quick-action-btn"
                onClick={() => window.location.href = '/supervisor/reportes'}
              >
                Ver Todos los Reportes
              </Button>
              <Button 
                variant="outline" 
                className="quick-action-btn"
                onClick={() => window.location.href = '/supervisor/encargados'}
              >
                Ver Mi Equipo
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Detalle */}
      <ReporteDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReporte(null);
        }}
        reporte={selectedReporte}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
        onObservar={handleObservar}
        userRole="supervisor"
      />
    </div>
  );
};

export default SupervisorDashboard;