import React, { useState, useEffect, useCallback } from 'react';
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
import './Reportes.scss';

// MOCK DATA - Reportes
const mockReportes = [
  {
    id: 1,
    tipo: 'Poste Eléctrico',
    fecha: '2025-01-29',
    hora: '09:30:00',
    encargado: 'Carlos Ramírez',
    supervisor: 'Juan Pérez',
    zona: 'Lima Norte',
    sector: 'Sector A1',
    estado: 'pendiente',
    gps: {
      lat: -12.0464,
      lng: -77.0428,
      precision: 5
    },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista frontal' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista lateral' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Detalle estructura' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Código identificación' }
    ],
    datos: {
      'Material': 'Concreto',
      'Altura': '12 metros',
      'Estado': 'Bueno',
      'Propietario': 'Luz del Sur',
      'Código': 'PE-001-2025'
    },
    observaciones: 'Estructura en buen estado, sin inclinación visible.',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Carlos Ramírez',
        fecha: '2025-01-29 09:30',
        comentario: null
      }
    ]
  },
  {
    id: 2,
    tipo: 'Poste Telemático',
    fecha: '2025-01-28',
    hora: '14:15:00',
    encargado: 'Lucía Mendoza',
    supervisor: 'María García',
    zona: 'Lima Sur',
    sector: 'Sector B1',
    estado: 'aprobado',
    gps: {
      lat: -12.1200,
      lng: -77.0300,
      precision: 3
    },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista general' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Caja de empalme' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Cables' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Identificación' }
    ],
    datos: {
      'Material': 'Metálico',
      'Altura': '15 metros',
      'Estado': 'Excelente',
      'Operador': 'Claro',
      'Código': 'PT-002-2025'
    },
    observaciones: null,
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Lucía Mendoza',
        fecha: '2025-01-28 14:15'
      },
      {
        tipo: 'aprobado',
        accion: 'Reporte aprobado',
        usuario: 'María García (Supervisor)',
        fecha: '2025-01-28 16:30',
        comentario: 'Registro completo y correcto'
      }
    ]
  },
  {
    id: 3,
    tipo: 'Poste Eléctrico',
    fecha: '2025-01-27',
    hora: '11:00:00',
    encargado: 'Roberto Quispe',
    supervisor: 'Juan Pérez',
    zona: 'Lima Norte',
    sector: 'Sector A2',
    estado: 'observado',
    gps: {
      lat: -12.0500,
      lng: -77.0500,
      precision: 8
    },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista frontal' },
      { url: 'https://via.placeholder.com/400', descripcion: 'Vista trasera' }
    ],
    datos: {
      'Material': 'Madera',
      'Altura': '10 metros',
      'Estado': 'Regular',
      'Propietario': 'Enel',
      'Código': 'PE-003-2025'
    },
    observaciones: 'Poste con inclinación leve hacia el este.',
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Roberto Quispe',
        fecha: '2025-01-27 11:00'
      },
      {
        tipo: 'observado',
        accion: 'Reporte observado',
        usuario: 'Juan Pérez (Supervisor)',
        fecha: '2025-01-27 15:20',
        comentario: 'Faltan 2 fotos obligatorias (lateral derecha e identificación)'
      }
    ]
  },
  {
    id: 4,
    tipo: 'Poste Telemático',
    fecha: '2025-01-26',
    hora: '08:45:00',
    encargado: 'Sofía Vega',
    supervisor: 'Ana Torres',
    zona: 'Lima Centro',
    sector: 'Sector D1',
    estado: 'rechazado',
    gps: {
      lat: -12.0700,
      lng: -77.0350,
      precision: 15
    },
    fotos: [
      { url: 'https://via.placeholder.com/400', descripcion: 'Foto borrosa' }
    ],
    datos: {
      'Material': 'Concreto',
      'Altura': '14 metros',
      'Estado': 'Malo',
      'Operador': 'Movistar',
      'Código': 'PT-004-2025'
    },
    observaciones: null,
    historial: [
      {
        tipo: 'creado',
        accion: 'Reporte creado',
        usuario: 'Sofía Vega',
        fecha: '2025-01-26 08:45'
      },
      {
        tipo: 'rechazado',
        accion: 'Reporte rechazado',
        usuario: 'Ana Torres (Supervisor)',
        fecha: '2025-01-26 12:00',
        comentario: 'Fotos de mala calidad y GPS con baja precisión (15m). Rehacer el reporte.'
      }
    ]
  }
];

const Reportes = () => {
  const { user } = useAuth();
  const [reportes, setReportes] = useState(mockReportes);
  const [filteredData, setFilteredData] = useState(mockReportes);
  const [loading, setLoading] = useState(false);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [zonaFilter, setZonaFilter] = useState('todos');
  const [encargadoFilter, setEncargadoFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Modal de detalle
  const [selectedReporte, setSelectedReporte] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Obtener valores únicos para filtros
  const tipos = ['todos', ...new Set(reportes.map(r => r.tipo))];
  const zonas = ['todos', ...new Set(reportes.map(r => r.zona))];
  const encargados = ['todos', ...new Set(reportes.map(r => r.encargado))];

  // Aplicar filtros
  useEffect(() => {
    let filtered = reportes;

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.encargado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    if (zonaFilter !== 'todos') {
      filtered = filtered.filter(r => r.zona === zonaFilter);
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
  }, [searchTerm, tipoFilter, estadoFilter, zonaFilter, encargadoFilter, startDate, endDate, reportes]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setTipoFilter('todos');
    setEstadoFilter('todos');
    setZonaFilter('todos');
    setEncargadoFilter('todos');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || tipoFilter !== 'todos' || estadoFilter !== 'todos' || zonaFilter !== 'todos' || encargadoFilter !== 'todos' || startDate || endDate;

  // Columnas de la tabla
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
      key: 'zona',
      label: 'Zona',
      sortable: true
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

  // Acciones por fila
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
                usuario: `${user.nombres} ${user.apellidos} (${user.rol})`,
                fecha: new Date().toLocaleString('es-PE'),
                comentario: null
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
                usuario: `${user.nombres} ${user.apellidos} (${user.rol})`,
                fecha: new Date().toLocaleString('es-PE'),
                comentario: null
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
                usuario: `${user.nombres} ${user.apellidos} (${user.rol})`,
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
        'Supervisor': reporte.supervisor,
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
        'Listado de Reportes'
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
    <div className="reportes-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Gestión de Reportes</h1>
          <p className="page-subtitle">
            Administra y valida los reportes de campo
          </p>
        </div>
        <div className="page-header-stats">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{reportes.length}</span>
          </div>
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
              placeholder="Buscar por ID, encargado, zona..."
              onSearch={setSearchTerm}
              initialValue={searchTerm}
            />
            <Button
              variant="outline"
              leftIcon={<FaFilter />}
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'active' : ''}
            >
              Filtros {hasActiveFilters && `(${[tipoFilter !== 'todos', estadoFilter !== 'todos', zonaFilter !== 'todos', encargadoFilter !== 'todos', startDate, endDate].filter(Boolean).length})`}
            </Button>
          </div>
          <div className="filters-right">
            <ExportButton
              data={filteredData}
              onExport={handleExport}
              filename={`reportes-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-row">
              <div className="filter-group">
                <label>Tipo</label>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="filter-select"
                >
                  {tipos.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo === 'todos' ? 'Todos' : tipo}
                    </option>
                  ))}
                </select>
              </div>

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
                <label>Zona</label>
                <select
                  value={zonaFilter}
                  onChange={(e) => setZonaFilter(e.target.value)}
                  className="filter-select"
                >
                  {zonas.map(zona => (
                    <option key={zona} value={zona}>
                      {zona === 'todos' ? 'Todas' : zona}
                    </option>
                  ))}
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
        userRole={user?.rol}
      />
    </div>
  );
};

export default Reportes;