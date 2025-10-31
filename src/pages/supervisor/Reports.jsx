import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import DateRangePicker from '../../components/common/DateRangePicker';
import ExportButton from '../../components/common/ExportButton';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ReporteDetailModal from '../../components/admin/ReporteDetailModal';
import { 
  FaFilter,
  FaTimes,
  FaEye,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { exportData } from '../../utils/exportUtils';
import './Reports.scss';

// MOCK DATA - Todos los reportes de la zona del supervisor
const mockReportes = [
  {
    id: 1,
    tipo: 'Poste Eléctrico',
    fecha: '2025-01-31',
    hora: '09:30:00',
    encargado: 'Carlos Ramírez',
    supervisor: 'Juan Pérez',
    zona: 'Lima Norte',
    sector: 'Sector A1',
    estado: 'pendiente',
    gps: { lat: -12.0464, lng: -77.0428, precision: 5 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista frontal' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista lateral' }
    ],
    datos: {
      'Material': 'Concreto',
      'Altura': '12 metros',
      'Estado': 'Bueno'
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
    id: 2,
    tipo: 'Poste Telemático',
    fecha: '2025-01-30',
    hora: '14:15:00',
    encargado: 'Lucía Mendoza',
    supervisor: 'Juan Pérez',
    zona: 'Lima Norte',
    sector: 'Sector A2',
    estado: 'aprobado',
    gps: { lat: -12.0500, lng: -77.0450, precision: 3 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'General' }
    ],
    datos: {
      'Material': 'Metálico',
      'Altura': '15 metros'
    },
    observaciones: null,
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Lucía Mendoza',
        fecha: '2025-01-30 14:15'
      },
      {
        tipo: 'aprobado',
        accion: 'Reporte aprobado',
        usuario: 'Juan Pérez (Supervisor)',
        fecha: '2025-01-30 16:00',
        comentario: 'Correcto'
      }
    ]
  },
  {
    id: 3,
    tipo: 'Poste Eléctrico',
    fecha: '2025-01-29',
    hora: '11:00:00',
    encargado: 'Roberto Quispe',
    supervisor: 'Juan Pérez',
    zona: 'Lima Norte',
    sector: 'Sector A1',
    estado: 'observado',
    gps: { lat: -12.0480, lng: -77.0440, precision: 8 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Frontal' }
    ],
    datos: {
      'Material': 'Madera',
      'Altura': '10 metros'
    },
    observaciones: 'Inclinación leve',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Roberto Quispe',
        fecha: '2025-01-29 11:00'
      },
      {
        tipo: 'observado',
        accion: 'Reporte observado',
        usuario: 'Juan Pérez (Supervisor)',
        fecha: '2025-01-29 15:00',
        comentario: 'Faltan fotos laterales'
      }
    ]
  },
  {
    id: 4,
    tipo: 'Predio',
    fecha: '2025-01-28',
    hora: '10:45:00',
    encargado: 'Ana Torres',
    supervisor: 'Juan Pérez',
    zona: 'Lima Centro',
    sector: 'Sector C1',
    estado: 'pendiente',
    gps: { lat: -12.0600, lng: -77.0300, precision: 4 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Fachada principal' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Interior' }
    ],
    datos: {
      'Tipo de Predio': 'Residencial',
      'Área': '120 m²',
      'Niveles': '2',
      'Estado': 'Bueno'
    },
    observaciones: 'Predio en condiciones óptimas',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Ana Torres',
        fecha: '2025-01-28 10:45'
      }
    ]
  },
  {
    id: 5,
    tipo: 'Predio',
    fecha: '2025-01-27',
    hora: '16:20:00',
    encargado: 'Luis Gamarra',
    supervisor: 'Juan Pérez',
    zona: 'Lima Sur',
    sector: 'Sector D2',
    estado: 'aprobado',
    gps: { lat: -12.0800, lng: -77.0500, precision: 6 },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista aérea' }
    ],
    datos: {
      'Tipo de Predio': 'Comercial',
      'Área': '300 m²',
      'Niveles': '1',
      'Estado': 'Regular'
    },
    observaciones: 'Requiere mantenimiento en fachada',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Luis Gamarra',
        fecha: '2025-01-27 16:20'
      },
      {
        tipo: 'aprobado',
        accion: 'Reporte aprobado',
        usuario: 'Juan Pérez (Supervisor)',
        fecha: '2025-01-27 18:00',
        comentario: 'Aprobar con observación'
      }
    ]
  }
];

const SupervisorReports = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = useState(mockReportes);
  const [filteredData, setFilteredData] = useState(mockReportes);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [encargadoFilter, setEncargadoFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedReporte, setSelectedReporte] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const location = useLocation();

  let sidebarTipo = 'todos';
  if (location.pathname.endsWith('/postes')) sidebarTipo = 'postes';
  else if (location.pathname.endsWith('/predios')) sidebarTipo = 'predios';

  const tipos = ['todos', ...new Set(reportes.map(r => r.tipo))];
  const encargados = ['todos', ...new Set(reportes.map(r => r.encargado))];

  const tiposFiltrados = sidebarTipo === 'postes'
    ? tipos.filter(t => t === 'todos' || t.includes('Poste'))
    : tipos;

  useEffect(() => {
    let filtered = reportes;

    // Filtro por sidebar según la URL
    if (sidebarTipo === 'postes') {
      filtered = filtered.filter(r => r.tipo === 'Poste Eléctrico' || r.tipo === 'Poste Telemático');
    } else if (sidebarTipo === 'predios') {
      filtered = filtered.filter(r => r.tipo === 'Predio');
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.encargado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toString().includes(searchTerm)
      );
    }

    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(r => r.tipo === tipoFilter);
    }

    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(r => r.estado === estadoFilter);
    }

    if (encargadoFilter !== 'todos') {
      filtered = filtered.filter(r => r.encargado === encargadoFilter);
    }

    if (startDate) {
      filtered = filtered.filter(r => r.fecha >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(r => r.fecha <= endDate);
    }

    setFilteredData(filtered);
  }, [sidebarTipo, searchTerm, tipoFilter, estadoFilter, encargadoFilter, startDate, endDate, reportes]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setTipoFilter('todos');
    setEstadoFilter('todos');
    setEncargadoFilter('todos');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || tipoFilter !== 'todos' || estadoFilter !== 'todos' || encargadoFilter !== 'todos' || startDate || endDate;

  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      sortable: true,
      render: (value) => `#${value}`
    },
    {
      key: 'tipo',
      label: 'Tipo',
      sortable: true,
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
      key: 'fecha',
      label: 'Fecha',
      width: '110px',
      sortable: true
    },
    {
      key: 'encargado',
      label: 'Encargado',
      sortable: true,
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
          color: value.precision <= 5 ? '#28a745' : value.precision <= 10 ? '#ffc107' : '#dc3545',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          ±{value.precision}m
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      width: '120px',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    }
  ];

  const renderActions = (reporte) => (
    <div className="table-actions">
      <button
        className="action-btn action-btn--view"
        onClick={() => handleViewDetail(reporte)}
        title="Ver Detalle"
      >
        <FaEye />
      </button>
      <button
        className="action-btn action-btn--map"
        onClick={() => handleViewMap(reporte)}
        title="Ver en Mapa"
      >
        <FaMapMarkedAlt />
      </button>
    </div>
  );

  const handleViewDetail = (reporte) => {
    setSelectedReporte(reporte);
    setIsDetailModalOpen(true);
  };

  const handleViewMap = (reporte) => {
    const url = `https://www.google.com/maps?q=${reporte.gps.lat},${reporte.gps.lng}`;
    window.open(url, '_blank');
  };

  const handleAprobar = (reporteId) => {
    setReportes(prev => prev.map(r => 
      r.id === reporteId 
        ? { 
            ...r, 
            estado: 'aprobado',
            historial: [
              ...r.historial,
              {
                tipo: 'aprobado',
                accion: 'Reporte aprobado',
                usuario: `${user.nombres} ${user.apellidos} (Supervisor)`,
                fecha: new Date().toLocaleString('es-PE')
              }
            ]
          }
        : r
    ));
    alert('✅ Reporte aprobado exitosamente');
  };

  const handleRechazar = (reporteId) => {
    setReportes(prev => prev.map(r => 
      r.id === reporteId 
        ? { 
            ...r, 
            estado: 'rechazado',
            historial: [
              ...r.historial,
              {
                tipo: 'rechazado',
                accion: 'Reporte rechazado',
                usuario: `${user.nombres} ${user.apellidos} (Supervisor)`,
                fecha: new Date().toLocaleString('es-PE')
              }
            ]
          }
        : r
    ));
    alert('✅ Reporte rechazado exitosamente');
  };

  const handleObservar = (reporteId, observacion) => {
    setReportes(prev => prev.map(r => 
      r.id === reporteId 
        ? { 
            ...r, 
            estado: 'observado',
            historial: [
              ...r.historial,
              {
                tipo: 'observado',
                accion: 'Reporte observado',
                usuario: `${user.nombres} ${user.apellidos} (Supervisor)`,
                fecha: new Date().toLocaleString('es-PE'),
                comentario: observacion
              }
            ]
          }
        : r
    ));
    alert('✅ Reporte observado exitosamente');
  };

  const handleExport = useCallback(async (format, filename) => {
    try {
      const dataToExport = filteredData.map(reporte => ({
        'ID': reporte.id,
        'Tipo': reporte.tipo,
        'Fecha': reporte.fecha,
        'Hora': reporte.hora,
        'Encargado': reporte.encargado,
        'Zona': reporte.zona,
        'Sector': reporte.sector,
        'Estado': reporte.estado,
        'Latitud': reporte.gps.lat,
        'Longitud': reporte.gps.lng,
        'Precisión GPS': `${reporte.gps.precision}m`
      }));

      const result = await exportData(
        format,
        dataToExport,
        filename,
        'Listado de Reportes - Supervisor'
      );

      if (result.success) {
        return true;
      } else {
        throw new Error('Error al exportar');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      throw error;
    }
  }, [filteredData]);

  return (
    <div className="supervisor-reportes-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Mis Reportes</h1>
          <p className="page-subtitle">
            Gestiona y valida los reportes de tu zona
          </p>
        </div>
        <div className="page-header-stats">
          <div className="stat-card stat-card--warning">
            <span className="stat-label">Pendientes</span>
            <span className="stat-value">
              {reportes.filter(r => r.estado === 'pendiente').length}
            </span>
          </div>
          <div className="stat-card stat-card--success">
            <span className="stat-label">Aprobados</span>
            <span className="stat-value">
              {reportes.filter(r => r.estado === 'aprobado').length}
            </span>
          </div>
        </div>
      </div>

      <Card className="filters-card">
        <div className="filters-header">
          <div className="filters-left">
            <SearchBar
              placeholder="Buscar por ID, encargado..."
              onSearch={setSearchTerm}
              initialValue={searchTerm}
            />
            <Button
              variant="outline"
              leftIcon={<FaFilter />}
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'active' : ''}
            >
              Filtros {hasActiveFilters && `(${[tipoFilter !== 'todos', estadoFilter !== 'todos', encargadoFilter !== 'todos', startDate, endDate].filter(Boolean).length})`}
            </Button>
          </div>
          <div className="filters-right">
            <ExportButton
              data={filteredData}
              onExport={handleExport}
              filename={`reportes-supervisor-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-row">
              {sidebarTipo !== 'predios' && (
                <div className="filter-group">
                  <label>Tipo</label>
                  <select
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                    className="filter-select"
                  >
                    {tiposFiltrados.map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo === 'todos' ? 'Todos' : tipo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="filter-group">
                <label>Estado</label>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="observado">Observados</option>
                  <option value="rechazado">Rechazados</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Encargado</label>
                <select
                  value={encargadoFilter}
                  onChange={(e) => setEncargadoFilter(e.target.value)}
                  className="filter-select"
                >
                  {encargados.map(enc => (
                    <option key={enc} value={enc}>
                      {enc === 'todos' ? 'Todos' : enc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group filter-group--date">
                <label>Rango de Fechas</label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="filters-actions">
                <Button
                  variant="outline"
                  size="small"
                  leftIcon={<FaTimes />}
                  onClick={handleClearFilters}
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          actions={renderActions}
          emptyMessage="No se encontraron reportes"
          pagination={true}
          itemsPerPage={10}
          sortable={true}
        />
      </Card>

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

export default SupervisorReports;