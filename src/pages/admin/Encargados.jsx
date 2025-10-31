import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import DateRangePicker from '../../components/common/DateRangePicker';
import ExportButton from '../../components/common/ExportButton';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { 
  FaPlus, 
  FaEdit, 
  FaPowerOff, 
  FaKey,
  FaFilter,
  FaTimes,
  FaMapMarkedAlt
} from 'react-icons/fa';
import './Encargados.scss';
import { exportData } from '../../utils/exportUtils';

// MOCK DATA - Supervisores disponibles
const mockSupervisores = [
  { id: 1, nombre: 'Juan Carlos Pérez', zona: 'Lima Norte' },
  { id: 2, nombre: 'María Elena García', zona: 'Lima Sur' },
  { id: 3, nombre: 'Pedro López', zona: 'Lima Este' },
  { id: 4, nombre: 'Ana Torres', zona: 'Lima Centro' }
];

// MOCK DATA - Sectores disponibles
const mockSectores = [
  { id: 1, nombre: 'Sector A1', zona: 'Lima Norte' },
  { id: 2, nombre: 'Sector A2', zona: 'Lima Norte' },
  { id: 3, nombre: 'Sector B1', zona: 'Lima Sur' },
  { id: 4, nombre: 'Sector B2', zona: 'Lima Sur' },
  { id: 5, nombre: 'Sector C1', zona: 'Lima Este' },
  { id: 6, nombre: 'Sector C2', zona: 'Lima Este' },
  { id: 7, nombre: 'Sector D1', zona: 'Lima Centro' },
  { id: 8, nombre: 'Sector D2', zona: 'Lima Centro' }
];

// MOCK DATA - Encargados
const mockEncargados = [
  {
    id: 1,
    dni: '55555555',
    nombres: 'Carlos',
    apellidos: 'Ramírez Torres',
    email: 'carlos.ramirez@telecorp.com',
    celular: '987654321',
    supervisor_id: 1,
    supervisor_nombre: 'Juan Carlos Pérez',
    zona: 'Lima Norte',
    sectores_asignados: ['Sector A1', 'Sector A2'],
    estado: 'activo',
    fecha_creacion: '2024-01-20',
    reportes: 45
  },
  {
    id: 2,
    dni: '66666666',
    nombres: 'Lucía',
    apellidos: 'Mendoza Silva',
    email: 'lucia.mendoza@telecorp.com',
    celular: '912345678',
    supervisor_id: 2,
    supervisor_nombre: 'María Elena García',
    zona: 'Lima Sur',
    sectores_asignados: ['Sector B1'],
    estado: 'activo',
    fecha_creacion: '2024-02-15',
    reportes: 32
  },
  {
    id: 3,
    dni: '77777777',
    nombres: 'Roberto',
    apellidos: 'Quispe Huamán',
    email: 'roberto.quispe@telecorp.com',
    celular: '998877665',
    supervisor_id: 1,
    supervisor_nombre: 'Juan Carlos Pérez',
    zona: 'Lima Norte',
    sectores_asignados: [],
    estado: 'inactivo',
    fecha_creacion: '2023-11-05',
    reportes: 0
  },
  {
    id: 4,
    dni: '88888888',
    nombres: 'Sofía',
    apellidos: 'Vega Castillo',
    email: 'sofia.vega@telecorp.com',
    celular: '955443322',
    supervisor_id: 4,
    supervisor_nombre: 'Ana Torres',
    zona: 'Lima Centro',
    sectores_asignados: ['Sector D1', 'Sector D2'],
    estado: 'activo',
    fecha_creacion: '2024-03-10',
    reportes: 28
  }
];

const Encargados = () => {
  const { user } = useAuth();
  const [encargados, setEncargados] = useState(mockEncargados);
  const [filteredData, setFilteredData] = useState(mockEncargados);
  const [loading, setLoading] = useState(false);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [supervisorFilter, setSupervisorFilter] = useState('todos');
  const [zonaFilter, setZonaFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSectoresModalOpen, setIsSectoresModalOpen] = useState(false);
  const [selectedEncargado, setSelectedEncargado] = useState(null);

  // Estados de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    encargado: null
  });

  // Form state
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    supervisor_id: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [savingForm, setSavingForm] = useState(false);

  // Sectores seleccionados
  const [selectedSectores, setSelectedSectores] = useState([]);

  // Obtener valores únicos para filtros
  const zonas = ['todos', ...new Set(encargados.map(e => e.zona))];
  const supervisores = ['todos', ...mockSupervisores.map(s => ({ id: s.id, nombre: s.nombre }))];

  // Aplicar filtros
  useEffect(() => {
    let filtered = encargados;

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.dni.includes(searchTerm) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(e => e.estado === estadoFilter);
    }

    if (supervisorFilter !== 'todos') {
      filtered = filtered.filter(e => e.supervisor_id === parseInt(supervisorFilter));
    }

    if (zonaFilter !== 'todos') {
      filtered = filtered.filter(e => e.zona === zonaFilter);
    }

    if (startDate) {
      filtered = filtered.filter(e => e.fecha_creacion >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(e => e.fecha_creacion <= endDate);
    }

    setFilteredData(filtered);
  }, [searchTerm, estadoFilter, supervisorFilter, zonaFilter, startDate, endDate, encargados]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setEstadoFilter('todos');
    setSupervisorFilter('todos');
    setZonaFilter('todos');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || estadoFilter !== 'todos' || supervisorFilter !== 'todos' || zonaFilter !== 'todos' || startDate || endDate;

  // Columnas de la tabla
  const columns = [
    {
      key: 'dni',
      label: 'DNI',
      width: '100px',
      sortable: true
    },
    {
      key: 'nombres',
      label: 'Nombres',
      sortable: true,
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.nombres} {row.apellidos}</div>
          <div style={{ fontSize: '13px', color: '#6c757d' }}>{row.email}</div>
        </div>
      )
    },
    {
      key: 'celular',
      label: 'Celular',
      width: '120px'
    },
    {
      key: 'supervisor_nombre',
      label: 'Supervisor',
      sortable: true,
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{row.zona}</div>
        </div>
      )
    },
    {
      key: 'sectores_asignados',
      label: 'Sectores',
      width: '120px',
      render: (value) => (
        <span style={{ 
          fontWeight: 600, 
          color: value.length > 0 ? '#0066cc' : '#6c757d' 
        }}>
          {value.length} sector{value.length !== 1 ? 'es' : ''}
        </span>
      )
    },
    {
      key: 'reportes',
      label: 'Reportes',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span style={{ fontWeight: 600 }}>{value}</span>
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
  const renderActions = (encargado) => (
    <div className="table-actions">
      <button
        className="action-btn action-btn--info"
        onClick={() => handleAsignarSectores(encargado)}
        title="Asignar Sectores"
      >
        <FaMapMarkedAlt />
      </button>
      <button
        className="action-btn action-btn--edit"
        onClick={() => handleEdit(encargado)}
        title="Editar"
      >
        <FaEdit />
      </button>
      <button
        className={`action-btn action-btn--${encargado.estado === 'activo' ? 'danger' : 'success'}`}
        onClick={() => handleToggleStatus(encargado)}
        title={encargado.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <FaPowerOff />
      </button>
      <button
        className="action-btn action-btn--warning"
        onClick={() => handleResetPassword(encargado)}
        title="Resetear Contraseña"
      >
        <FaKey />
      </button>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.dni || formData.dni.length !== 8) {
      errors.dni = 'El DNI debe tener 8 dígitos';
    }
    if (!formData.nombres.trim()) {
      errors.nombres = 'Los nombres son requeridos';
    }
    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son requeridos';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.celular || formData.celular.length !== 9) {
      errors.celular = 'El celular debe tener 9 dígitos';
    }
    if (!formData.supervisor_id) {
      errors.supervisor_id = 'El supervisor es requerido';
    }
    if (!selectedEncargado && !formData.password) {
      errors.password = 'La contraseña es requerida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = () => {
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      celular: '',
      supervisor_id: '',
      password: ''
    });
    setFormErrors({});
    setSelectedEncargado(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!validateForm()) return;

    setSavingForm(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const supervisor = mockSupervisores.find(s => s.id === parseInt(formData.supervisor_id));

      const newEncargado = {
        id: encargados.length + 1,
        ...formData,
        supervisor_nombre: supervisor.nombre,
        zona: supervisor.zona,
        sectores_asignados: [],
        estado: 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0],
        reportes: 0
      };

      setEncargados(prev => [...prev, newEncargado]);
      setIsCreateModalOpen(false);
      alert('✅ Encargado creado exitosamente');
    } catch (error) {
      alert('❌ Error al crear encargado');
    } finally {
      setSavingForm(false);
    }
  };

  const handleEdit = (encargado) => {
    setSelectedEncargado(encargado);
    setFormData({
      dni: encargado.dni,
      nombres: encargado.nombres,
      apellidos: encargado.apellidos,
      email: encargado.email,
      celular: encargado.celular,
      supervisor_id: encargado.supervisor_id.toString(),
      password: ''
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;

    setSavingForm(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const supervisor = mockSupervisores.find(s => s.id === parseInt(formData.supervisor_id));

      setEncargados(prev => prev.map(e => 
        e.id === selectedEncargado.id 
          ? { 
              ...e, 
              ...formData,
              supervisor_nombre: supervisor.nombre,
              zona: supervisor.zona
            }
          : e
      ));

      setIsEditModalOpen(false);
      alert('✅ Encargado actualizado exitosamente');
    } catch (error) {
      alert('❌ Error al actualizar encargado');
    } finally {
      setSavingForm(false);
    }
  };

  const handleAsignarSectores = (encargado) => {
    setSelectedEncargado(encargado);
    setSelectedSectores(encargado.sectores_asignados || []);
    setIsSectoresModalOpen(true);
  };

  const handleToggleSector = (sector) => {
    setSelectedSectores(prev => {
      if (prev.includes(sector)) {
        return prev.filter(s => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

  const handleSaveSectores = async () => {
    setSavingForm(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      setEncargados(prev => prev.map(e => 
        e.id === selectedEncargado.id 
          ? { ...e, sectores_asignados: selectedSectores }
          : e
      ));

      setIsSectoresModalOpen(false);
      alert('✅ Sectores asignados exitosamente');
    } catch (error) {
      alert('❌ Error al asignar sectores');
    } finally {
      setSavingForm(false);
    }
  };

  const handleToggleStatus = (encargado) => {
    setConfirmDialog({
      isOpen: true,
      type: 'toggle',
      encargado
    });
  };

  const handleConfirmToggle = async () => {
    const encargado = confirmDialog.encargado;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      setEncargados(prev => prev.map(e => 
        e.id === encargado.id 
          ? { ...e, estado: e.estado === 'activo' ? 'inactivo' : 'activo' }
          : e
      ));

      setConfirmDialog({ isOpen: false, type: null, encargado: null });
      alert(`✅ Encargado ${encargado.estado === 'activo' ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error) {
      alert('❌ Error al cambiar estado');
    }
  };

  const handleResetPassword = (encargado) => {
    setConfirmDialog({
      isOpen: true,
      type: 'reset',
      encargado
    });
  };

  const handleConfirmReset = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const newPassword = 'FieldOps' + Math.floor(Math.random() * 10000);
      
      setConfirmDialog({ isOpen: false, type: null, encargado: null });
      alert(`✅ Contraseña reseteada exitosamente\n\nNueva contraseña: ${newPassword}\n\nSe ha enviado un email a: ${confirmDialog.encargado.email}`);
    } catch (error) {
      alert('❌ Error al resetear contraseña');
    }
  };

  // Exportar datos
  const handleExport = useCallback(async (format, filename) => {
    try {
      // Preparar datos para exportar
      const dataToExport = filteredData.map(encargado => ({
        DNI: encargado.dni,
        Nombres: encargado.nombres,
        Apellidos: encargado.apellidos,
        Email: encargado.email,
        Celular: encargado.celular,
        Supervisor: encargado.supervisor_nombre,
        Zona: encargado.zona,
        'Sectores Asignados': encargado.sectores_asignados.join(', '),
        Reportes: encargado.reportes,
        Estado: encargado.estado,
        'Fecha Creación': encargado.fecha_creacion
      }));

      // Exportar según formato
      const result = await exportData(
        format,
        dataToExport,
        filename,
        'Listado de Encargados'
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

  // Filtrar sectores disponibles según el supervisor seleccionado
  const sectoresDisponibles = selectedEncargado 
    ? mockSectores.filter(s => s.zona === selectedEncargado.zona)
    : [];

  return (
    <div className="encargados-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Gestión de Encargados</h1>
          <p className="page-subtitle">
            Administra los encargados de campo de tu empresa
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="primary"
            leftIcon={<FaPlus />}
            onClick={handleCreate}
          >
            Nuevo Encargado
          </Button>
        </div>
      </div>

      <Card className="filters-card">
        <div className="filters-header">
          <div className="filters-left">
            <SearchBar
              placeholder="Buscar por nombre, DNI o email..."
              onSearch={setSearchTerm}
              initialValue={searchTerm}
            />
            <Button
              variant="outline"
              leftIcon={<FaFilter />}
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'active' : ''}
            >
              Filtros {hasActiveFilters && `(${[estadoFilter !== 'todos', supervisorFilter !== 'todos', zonaFilter !== 'todos', startDate, endDate].filter(Boolean).length})`}
            </Button>
          </div>
          <div className="filters-right">
            <ExportButton
              data={filteredData}
              onExport={handleExport}
              filename={`supervisores-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-row">
              <div className="filter-group">
                <label>Estado</label>
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Supervisor</label>
                <select
                  value={supervisorFilter}
                  onChange={(e) => setSupervisorFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="todos">Todos</option>
                  {mockSupervisores.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
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

              <div className="filter-group filter-group--date">
                <label>Fecha de Creación</label>
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
          emptyMessage="No se encontraron encargados"
          pagination={true}
          itemsPerPage={10}
          sortable={true}
        />
      </Card>

      {/* Modal Crear Encargado */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !savingForm && setIsCreateModalOpen(false)}
        title="Crear Nuevo Encargado"
        size="medium"
      >
        <form className="encargado-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <Input
              label="DNI"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              error={formErrors.dni}
              maxLength={8}
              placeholder="12345678"
              required
            />
            <Input
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              error={formErrors.celular}
              maxLength={9}
              placeholder="987654321"
              required
            />
          </div>

          <Input
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleInputChange}
            error={formErrors.nombres}
            placeholder="Carlos"
            required
          />

          <Input
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
            error={formErrors.apellidos}
            placeholder="Ramírez Torres"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            placeholder="encargado@empresa.com"
            required
          />

          <div className="form-group">
            <label className="form-label">Supervisor Asignado *</label>
            <select
              name="supervisor_id"
              value={formData.supervisor_id}
              onChange={handleInputChange}
              className={`form-select ${formErrors.supervisor_id ? 'error' : ''}`}
              required
            >
              <option value="">Seleccionar supervisor...</option>
              {mockSupervisores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} - {s.zona}
                </option>
              ))}
            </select>
            {formErrors.supervisor_id && (
              <span className="form-error">{formErrors.supervisor_id}</span>
            )}
          </div>

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            placeholder="••••••••"
            required
          />

          <div className="form-note">
            <small>💡 Los sectores se pueden asignar después de crear el encargado</small>
          </div>
        </form>

        <Modal.Footer
          onCancel={() => setIsCreateModalOpen(false)}
          onConfirm={handleSaveCreate}
          cancelText="Cancelar"
          confirmText="Crear Encargado"
          confirmLoading={savingForm}
        />
      </Modal>

      {/* Modal Editar Encargado */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !savingForm && setIsEditModalOpen(false)}
        title="Editar Encargado"
        size="medium"
      >
        <form className="encargado-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <Input
              label="DNI"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              error={formErrors.dni}
              maxLength={8}
              disabled
            />
            <Input
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              error={formErrors.celular}
              maxLength={9}
              required
            />
          </div>

          <Input
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleInputChange}
            error={formErrors.nombres}
            required
          />

          <Input
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
            error={formErrors.apellidos}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            required
          />

          <div className="form-group">
            <label className="form-label">Supervisor Asignado *</label>
            <select
              name="supervisor_id"
              value={formData.supervisor_id}
              onChange={handleInputChange}
              className={`form-select ${formErrors.supervisor_id ? 'error' : ''}`}
              required
            >
              <option value="">Seleccionar supervisor...</option>
              {mockSupervisores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} - {s.zona}
                </option>
              ))}
            </select>
            {formErrors.supervisor_id && (
              <span className="form-error">{formErrors.supervisor_id}</span>
            )}
          </div>

          <div className="form-note">
            <small>💡 Deja la contraseña en blanco si no deseas cambiarla</small>
          </div>
          
          <Input
            label="Nueva Contraseña (opcional)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Dejar vacío para mantener actual"
          />
        </form>

        <Modal.Footer
          onCancel={() => setIsEditModalOpen(false)}
          onConfirm={handleSaveEdit}
          cancelText="Cancelar"
          confirmText="Guardar Cambios"
          confirmLoading={savingForm}
        />
      </Modal>

      {/* Modal Asignar Sectores */}
      <Modal
        isOpen={isSectoresModalOpen}
        onClose={() => !savingForm && setIsSectoresModalOpen(false)}
        title={`Asignar Sectores - ${selectedEncargado?.nombres} ${selectedEncargado?.apellidos}`}
        size="medium"
      >
        <div className="sectores-modal">
          <p className="sectores-info">
            Selecciona los sectores que deseas asignar a este encargado en la zona <strong>{selectedEncargado?.zona}</strong>.
          </p>

          {sectoresDisponibles.length === 0 ? (
            <div className="sectores-empty">
              <p>No hay sectores disponibles en esta zona.</p>
            </div>
          ) : (
            <div className="sectores-list">
              {sectoresDisponibles.map(sector => (
                <label
                  key={sector.id}
                  className={`sector-item ${selectedSectores.includes(sector.nombre) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSectores.includes(sector.nombre)}
                    onChange={() => handleToggleSector(sector.nombre)}
                    disabled={savingForm}
                  />
                  <div className="sector-info">
                    <span className="sector-name">{sector.nombre}</span>
                    <span className="sector-zone">{sector.zona}</span>
                  </div>
                  <div className="sector-check">
                    {selectedSectores.includes(sector.nombre) && (
                      <div className="check-icon">✓</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="sectores-summary">
            <p>
              <strong>Total seleccionados:</strong> {selectedSectores.length} de {sectoresDisponibles.length} sectores
            </p>
          </div>
        </div>

        <Modal.Footer
          onCancel={() => setIsSectoresModalOpen(false)}
          onConfirm={handleSaveSectores}
          cancelText="Cancelar"
          confirmText="Guardar Asignación"
          confirmLoading={savingForm}
        />
      </Modal>

      {/* Confirm Dialog - Toggle Status */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'toggle'}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, encargado: null })}
        onConfirm={handleConfirmToggle}
        title={confirmDialog.encargado?.estado === 'activo' ? '¿Desactivar Encargado?' : '¿Activar Encargado?'}
        message={
          confirmDialog.encargado?.estado === 'activo'
            ? `¿Estás seguro de desactivar a ${confirmDialog.encargado?.nombres} ${confirmDialog.encargado?.apellidos}? No podrá acceder al sistema.`
            : `¿Estás seguro de activar a ${confirmDialog.encargado?.nombres} ${confirmDialog.encargado?.apellidos}? Podrá acceder al sistema nuevamente.`
        }
        confirmText={confirmDialog.encargado?.estado === 'activo' ? 'Desactivar' : 'Activar'}
        variant={confirmDialog.encargado?.estado === 'activo' ? 'danger' : 'success'}
      />

      {/* Confirm Dialog - Reset Password */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'reset'}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, encargado: null })}
        onConfirm={handleConfirmReset}
        title="¿Resetear Contraseña?"
        message={`Se generará una nueva contraseña temporal para ${confirmDialog.encargado?.nombres} ${confirmDialog.encargado?.apellidos} y se enviará por email.`}
        confirmText="Resetear"
        variant="warning"
      />
    </div>
  );
};

export default Encargados;