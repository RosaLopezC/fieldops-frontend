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
  FaTimes
} from 'react-icons/fa';
import './Supervisores.scss';
import { exportData } from '../../utils/exportUtils';

// MOCK DATA - Después conectaremos con la API
const mockSupervisores = [
  {
    id: 1,
    dni: '11111111',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez González',
    email: 'juan.perez@telecorp.com',
    celular: '987654321',
    zona: 'Lima Norte',
    estado: 'activo',
    fecha_creacion: '2024-01-15',
    encargados: 5
  },
  {
    id: 2,
    dni: '22222222',
    nombres: 'María Elena',
    apellidos: 'García Rojas',
    email: 'maria.garcia@telecorp.com',
    celular: '912345678',
    zona: 'Lima Sur',
    estado: 'activo',
    fecha_creacion: '2024-02-20',
    encargados: 3
  },
  {
    id: 3,
    dni: '33333333',
    nombres: 'Pedro',
    apellidos: 'López Mendoza',
    email: 'pedro.lopez@telecorp.com',
    celular: '998877665',
    zona: 'Lima Este',
    estado: 'inactivo',
    fecha_creacion: '2023-11-10',
    encargados: 0
  },
  {
    id: 4,
    dni: '44444444',
    nombres: 'Ana',
    apellidos: 'Torres Silva',
    email: 'ana.torres@telecorp.com',
    celular: '955443322',
    zona: 'Lima Centro',
    estado: 'activo',
    fecha_creacion: '2024-03-05',
    encargados: 7
  }
];

const AdminSupervisores = () => {
  const { user } = useAuth();
  const [supervisores, setSupervisores] = useState(mockSupervisores);
  const [filteredData, setFilteredData] = useState(mockSupervisores);
  const [loading, setLoading] = useState(false);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [zonaFilter, setZonaFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Estados de modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  // Estados de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    supervisor: null
  });

  // Form state
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    zona: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [savingForm, setSavingForm] = useState(false);

  // Obtener zonas únicas
  const zonas = ['todos', ...new Set(supervisores.map(s => s.zona))];

  // Aplicar filtros
  useEffect(() => {
    let filtered = supervisores;

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.dni.includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de estado
    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(s => s.estado === estadoFilter);
    }

    // Filtro de zona
    if (zonaFilter !== 'todos') {
      filtered = filtered.filter(s => s.zona === zonaFilter);
    }

    // Filtro de fechas
    if (startDate) {
      filtered = filtered.filter(s => s.fecha_creacion >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(s => s.fecha_creacion <= endDate);
    }

    setFilteredData(filtered);
  }, [searchTerm, estadoFilter, zonaFilter, startDate, endDate, supervisores]);

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setEstadoFilter('todos');
    setZonaFilter('todos');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || estadoFilter !== 'todos' || zonaFilter !== 'todos' || startDate || endDate;

  // Definir columnas de la tabla
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
      key: 'zona',
      label: 'Zona',
      sortable: true
    },
    {
      key: 'encargados',
      label: 'Encargados',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span style={{ 
          fontWeight: 600, 
          color: value > 0 ? '#0066cc' : '#6c757d' 
        }}>
          {value}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      width: '120px',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'fecha_creacion',
      label: 'Fecha Creación',
      width: '130px',
      sortable: true
    }
  ];

  // Acciones por fila
  const renderActions = (supervisor) => (
    <div className="table-actions">
      <button
        className="action-btn action-btn--edit"
        onClick={() => handleEdit(supervisor)}
        title="Editar"
      >
        <FaEdit />
      </button>
      <button
        className={`action-btn action-btn--${supervisor.estado === 'activo' ? 'danger' : 'success'}`}
        onClick={() => handleToggleStatus(supervisor)}
        title={supervisor.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <FaPowerOff />
      </button>
      <button
        className="action-btn action-btn--warning"
        onClick={() => handleResetPassword(supervisor)}
        title="Resetear Contraseña"
      >
        <FaKey />
      </button>
    </div>
  );

  // Handlers de formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
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
    if (!formData.zona.trim()) {
      errors.zona = 'La zona es requerida';
    }
    if (!selectedSupervisor && !formData.password) {
      errors.password = 'La contraseña es requerida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Crear supervisor
  const handleCreate = () => {
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      celular: '',
      zona: '',
      password: ''
    });
    setFormErrors({});
    setSelectedSupervisor(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!validateForm()) return;

    setSavingForm(true);

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSupervisor = {
        id: supervisores.length + 1,
        ...formData,
        estado: 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0],
        encargados: 0
      };

      setSupervisores(prev => [...prev, newSupervisor]);
      setIsCreateModalOpen(false);
      alert('✅ Supervisor creado exitosamente');
    } catch (error) {
      alert('❌ Error al crear supervisor');
    } finally {
      setSavingForm(false);
    }
  };

  // Editar supervisor
  const handleEdit = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setFormData({
      dni: supervisor.dni,
      nombres: supervisor.nombres,
      apellidos: supervisor.apellidos,
      email: supervisor.email,
      celular: supervisor.celular,
      zona: supervisor.zona,
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

      setSupervisores(prev => prev.map(s => 
        s.id === selectedSupervisor.id 
          ? { ...s, ...formData }
          : s
      ));

      setIsEditModalOpen(false);
      alert('✅ Supervisor actualizado exitosamente');
    } catch (error) {
      alert('❌ Error al actualizar supervisor');
    } finally {
      setSavingForm(false);
    }
  };

  // Activar/Desactivar
  const handleToggleStatus = (supervisor) => {
    setConfirmDialog({
      isOpen: true,
      type: 'toggle',
      supervisor
    });
  };

  const handleConfirmToggle = async () => {
    const supervisor = confirmDialog.supervisor;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      setSupervisores(prev => prev.map(s => 
        s.id === supervisor.id 
          ? { ...s, estado: s.estado === 'activo' ? 'inactivo' : 'activo' }
          : s
      ));

      setConfirmDialog({ isOpen: false, type: null, supervisor: null });
      alert(`✅ Supervisor ${supervisor.estado === 'activo' ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error) {
      alert('❌ Error al cambiar estado');
    }
  };

  // Resetear contraseña
  const handleResetPassword = (supervisor) => {
    setConfirmDialog({
      isOpen: true,
      type: 'reset',
      supervisor
    });
  };

  const handleConfirmReset = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const newPassword = 'FieldOps' + Math.floor(Math.random() * 10000);
      
      setConfirmDialog({ isOpen: false, type: null, supervisor: null });
      alert(`✅ Contraseña reseteada exitosamente\n\nNueva contraseña: ${newPassword}\n\nSe ha enviado un email a: ${confirmDialog.supervisor.email}`);
    } catch (error) {
      alert('❌ Error al resetear contraseña');
    }
  };

  // Exportar datos
  const handleExport = useCallback(async (format, filename) => {
    try {
      // Preparar datos para exportar
      const dataToExport = filteredData.map(supervisor => ({
        DNI: supervisor.dni,
        Nombres: supervisor.nombres,
        Apellidos: supervisor.apellidos,
        Email: supervisor.email,
        Celular: supervisor.celular,
        Zona: supervisor.zona,
        Encargados: supervisor.encargados,
        Estado: supervisor.estado,
        'Fecha Creación': supervisor.fecha_creacion
      }));

      // Exportar según formato
      const result = await exportData(
        format,
        dataToExport,
        filename,
        'Listado de Supervisores'
      );

      if (result.success) {
        // Éxito - el archivo ya se descargó
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
    <div className="admin-supervisores">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Gestión de Supervisores</h1>
          <p className="page-subtitle">
            Administra los supervisores de tu empresa
          </p>
        </div>
        <div className="page-header-actions">
          <Button
            variant="primary"
            leftIcon={<FaPlus />}
            onClick={handleCreate}
          >
            Nuevo Supervisor
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
              Filtros {hasActiveFilters && `(${[estadoFilter !== 'todos', zonaFilter !== 'todos', startDate, endDate].filter(Boolean).length})`}
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

      <Table
        data={filteredData}
        columns={columns}
        loading={loading}
        onSort={(key, order) => {
          const sorted = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            return 0;
          });
          setFilteredData(sorted);
        }}
        renderRowActions={renderActions}
      />

      {/* Modal para crear supervisor */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Crear Supervisor"
      >
        <h2>Crear Supervisor</h2>
        <form onSubmit={e => { e.preventDefault(); handleSaveCreate(); }}>
          <div className="form-group">
            <label>DNI:</label>
            <Input 
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              error={formErrors.dni}
            />
          </div>
          <div className="form-group">
            <label>Nombres:</label>
            <Input 
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              error={formErrors.nombres}
            />
          </div>
          <div className="form-group">
            <label>Apellidos:</label>
            <Input 
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              error={formErrors.apellidos}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <Input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
            />
          </div>
          <div className="form-group">
            <label>Celular:</label>
            <Input 
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              error={formErrors.celular}
            />
          </div>
          <div className="form-group">
            <label>Zona:</label>
            <Input 
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              error={formErrors.zona}
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <Input 
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
            />
          </div>
          <div className="form-actions">
            <Button 
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              text="Cancelar"
              className="btn-secondary"
            />
            <Button 
              type="submit"
              text="Guardar"
              className="btn-primary"
              loading={savingForm}
            />
          </div>
        </form>
      </Modal>

      {/* Modal para editar supervisor */}
      <Modal 
        isOpen={isEditModalOpen} 
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Editar Supervisor"
      >
        <h2>Editar Supervisor</h2>
        <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
          <div className="form-group">
            <label>DNI:</label>
            <Input 
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              error={formErrors.dni}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Nombres:</label>
            <Input 
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              error={formErrors.nombres}
            />
          </div>
          <div className="form-group">
            <label>Apellidos:</label>
            <Input 
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              error={formErrors.apellidos}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <Input 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
            />
          </div>
          <div className="form-group">
            <label>Celular:</label>
            <Input 
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              error={formErrors.celular}
            />
          </div>
          <div className="form-group">
            <label>Zona:</label>
            <Input 
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              error={formErrors.zona}
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <Input 
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
            />
          </div>
          <div className="form-actions">
            <Button 
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              text="Cancelar"
              className="btn-secondary"
            />
            <Button 
              type="submit"
              text="Guardar Cambios"
              className="btn-primary"
              loading={savingForm}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onRequestClose={() => setConfirmDialog({ isOpen: false, type: null, supervisor: null })}
        onConfirm={confirmDialog.type === 'toggle' ? handleConfirmToggle : handleConfirmReset}
        title={confirmDialog.type === 'toggle' ? 'Cambiar Estado' : 'Resetear Contraseña'}
        message={confirmDialog.type === 'toggle' 
          ? `¿Estás seguro de ${confirmDialog.supervisor?.estado === 'activo' ? 'desactivar' : 'activar'} a ${confirmDialog.supervisor?.nombres || ''} ${confirmDialog.supervisor?.apellidos || ''}?`
          : `¿Estás seguro de resetear la contraseña de ${confirmDialog.supervisor?.nombres || ''} ${confirmDialog.supervisor?.apellidos || ''}?`}
        confirmText={confirmDialog.type === 'toggle' ? 'Sí, Cambiar' : 'Sí, Resetear'}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default AdminSupervisores;