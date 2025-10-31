import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { 
  FaBuilding, 
  FaProjectDiagram, 
  FaCog,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaImage
} from 'react-icons/fa';
import './Configuracion.scss';

// MOCK DATA
const mockEmpresa = {
  id: 1,
  nombre: 'TeleCorp SAC',
  ruc: '20123456789',
  direccion: 'Av. Larco 1234, Miraflores',
  telefono: '01-2345678',
  email: 'contacto@telecorp.com',
  logo: 'https://via.placeholder.com/150x150?text=LOGO',
  plan: 'Profesional',
  usuarios_max: 50,
  usuarios_activos: 12,
  almacenamiento_max: '100 GB',
  almacenamiento_usado: '23 GB'
};

const mockProyectos = [
  { 
    id: 1, 
    nombre: 'Expansión Red Norte 2025', 
    descripcion: 'Proyecto de expansión de red en Lima Norte',
    fecha_inicio: '2025-01-15',
    fecha_fin: '2025-06-30',
    estado: 'activo',
    reportes: 45
  },
  { 
    id: 2, 
    nombre: 'Mantenimiento Postes Sur', 
    descripcion: 'Mantenimiento preventivo zona sur',
    fecha_inicio: '2025-02-01',
    fecha_fin: '2025-12-31',
    estado: 'activo',
    reportes: 32
  },
  { 
    id: 3, 
    nombre: 'Auditoría Centro 2024', 
    descripcion: 'Auditoría de infraestructura completada',
    fecha_inicio: '2024-09-01',
    fecha_fin: '2024-12-31',
    estado: 'finalizado',
    reportes: 120
  }
];

const Configuracion = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('empresa');

  // Estados para Mi Empresa
  const [empresaData, setEmpresaData] = useState(mockEmpresa);
  const [editingEmpresa, setEditingEmpresa] = useState(false);
  const [empresaForm, setEmpresaForm] = useState(mockEmpresa);
  const [empresaErrors, setEmpresaErrors] = useState({});
  const [savingEmpresa, setSavingEmpresa] = useState(false);

  // Estados para Proyectos
  const [proyectos, setProyectos] = useState(mockProyectos);
  const [isCreateProyectoOpen, setIsCreateProyectoOpen] = useState(false);
  const [isEditProyectoOpen, setIsEditProyectoOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [proyectoForm, setProyectoForm] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [proyectoErrors, setProyectoErrors] = useState({});
  const [savingProyecto, setSavingProyecto] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, proyecto: null });

  // Tabs
  const tabs = [
    { id: 'empresa', label: 'Mi Empresa', icon: <FaBuilding /> },
    { id: 'proyectos', label: 'Proyectos', icon: <FaProjectDiagram /> },
    { id: 'general', label: 'General', icon: <FaCog /> }
  ];

  // FUNCIONES MI EMPRESA
  const handleEditEmpresa = () => {
    setEmpresaForm(empresaData);
    setEmpresaErrors({});
    setEditingEmpresa(true);
  };

  const handleCancelEditEmpresa = () => {
    setEditingEmpresa(false);
    setEmpresaForm(empresaData);
    setEmpresaErrors({});
  };

  const handleEmpresaInputChange = (e) => {
    const { name, value } = e.target;
    setEmpresaForm(prev => ({ ...prev, [name]: value }));
    if (empresaErrors[name]) {
      setEmpresaErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmpresaForm = () => {
    const errors = {};
    if (!empresaForm.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!empresaForm.ruc || empresaForm.ruc.length !== 11) errors.ruc = 'RUC debe tener 11 dígitos';
    if (!empresaForm.email.trim() || !/\S+@\S+\.\S+/.test(empresaForm.email)) {
      errors.email = 'Email inválido';
    }
    setEmpresaErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEmpresa = async () => {
    if (!validateEmpresaForm()) return;

    setSavingEmpresa(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setEmpresaData(empresaForm);
    setEditingEmpresa(false);
    setSavingEmpresa(false);
    alert('✅ Datos de empresa actualizados exitosamente');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulación de carga de imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmpresaForm(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // FUNCIONES PROYECTOS
  const proyectosColumns = [
    { key: 'id', label: 'ID', width: '80px', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { 
      key: 'fecha_inicio', 
      label: 'Fecha Inicio', 
      width: '120px',
      sortable: true 
    },
    { 
      key: 'fecha_fin', 
      label: 'Fecha Fin', 
      width: '120px',
      sortable: true 
    },
    { 
      key: 'reportes', 
      label: 'Reportes', 
      width: '100px',
      sortable: true,
      render: (value) => <span style={{ fontWeight: 600, color: '#0066cc' }}>{value}</span>
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      width: '120px',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    }
  ];

  const renderProyectoActions = (proyecto) => (
    <div className="table-actions">
      <button 
        className="action-btn action-btn--edit" 
        onClick={() => handleEditProyecto(proyecto)}
        title="Editar"
      >
        <FaEdit />
      </button>
      <button 
        className="action-btn action-btn--danger" 
        onClick={() => handleDeleteProyecto(proyecto)}
        title="Eliminar"
        disabled={proyecto.reportes > 0}
      >
        <FaTrash />
      </button>
    </div>
  );

  const handleCreateProyecto = () => {
    setProyectoForm({
      nombre: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setProyectoErrors({});
    setSelectedProyecto(null);
    setIsCreateProyectoOpen(true);
  };

  const handleEditProyecto = (proyecto) => {
    setSelectedProyecto(proyecto);
    setProyectoForm({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin
    });
    setProyectoErrors({});
    setIsEditProyectoOpen(true);
  };

  const handleDeleteProyecto = (proyecto) => {
    if (proyecto.reportes > 0) {
      alert('⚠️ No se puede eliminar un proyecto con reportes asociados');
      return;
    }
    setConfirmDialog({ isOpen: true, proyecto });
  };

  const handleProyectoInputChange = (e) => {
    const { name, value } = e.target;
    setProyectoForm(prev => ({ ...prev, [name]: value }));
    if (proyectoErrors[name]) {
      setProyectoErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProyectoForm = () => {
    const errors = {};
    if (!proyectoForm.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!proyectoForm.descripcion.trim()) errors.descripcion = 'La descripción es requerida';
    if (!proyectoForm.fecha_inicio) errors.fecha_inicio = 'La fecha de inicio es requerida';
    if (!proyectoForm.fecha_fin) errors.fecha_fin = 'La fecha de fin es requerida';
    
    if (proyectoForm.fecha_inicio && proyectoForm.fecha_fin) {
      if (proyectoForm.fecha_fin < proyectoForm.fecha_inicio) {
        errors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setProyectoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCreateProyecto = async () => {
    if (!validateProyectoForm()) return;

    setSavingProyecto(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newProyecto = {
      id: proyectos.length + 1,
      ...proyectoForm,
      estado: 'activo',
      reportes: 0
    };

    setProyectos(prev => [...prev, newProyecto]);
    setIsCreateProyectoOpen(false);
    setSavingProyecto(false);
    alert('✅ Proyecto creado exitosamente');
  };

  const handleSaveEditProyecto = async () => {
    if (!validateProyectoForm()) return;

    setSavingProyecto(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setProyectos(prev => prev.map(p => 
      p.id === selectedProyecto.id 
        ? { ...p, ...proyectoForm }
        : p
    ));

    setIsEditProyectoOpen(false);
    setSavingProyecto(false);
    alert('✅ Proyecto actualizado exitosamente');
  };

  const handleConfirmDeleteProyecto = async () => {
    setSavingProyecto(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setProyectos(prev => prev.filter(p => p.id !== confirmDialog.proyecto.id));
    setConfirmDialog({ isOpen: false, proyecto: null });
    setSavingProyecto(false);
    alert('✅ Proyecto eliminado exitosamente');
  };

  return (
    <div className="configuracion-page">
      <div className="page-header">
        <h1>Configuración</h1>
        <p className="page-subtitle">
          Aquí podrás modificar la configuración de la empresa, usuarios, etc.
        </p>
      </div>

      {/* Tabs */}
      <div className="config-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`config-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="config-content">
        {/* TAB: MI EMPRESA */}
        {activeTab === 'empresa' && (
          <Card>
            <div className="empresa-section">
              <div className="section-header">
                <h2>Información de la Empresa</h2>
                {!editingEmpresa && (
                  <Button
                    variant="outline"
                    leftIcon={<FaEdit />}
                    onClick={handleEditEmpresa}
                  >
                    Editar
                  </Button>
                )}
              </div>

              <div className="empresa-content">
                {/* Logo */}
                <div className="empresa-logo-section">
                  <div className="logo-preview">
                    <img src={empresaForm.logo} alt="Logo empresa" />
                  </div>
                  {editingEmpresa && (
                    <div className="logo-actions">
                      <label className="upload-button">
                        <FaImage />
                        <span>Cambiar Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <p className="upload-hint">PNG, JPG hasta 2MB</p>
                    </div>
                  )}
                </div>

                {/* Formulario */}
                <div className="empresa-form">
                  <div className="form-row">
                    <Input
                      label="Nombre de la Empresa"
                      name="nombre"
                      value={empresaForm.nombre}
                      onChange={handleEmpresaInputChange}
                      error={empresaErrors.nombre}
                      disabled={!editingEmpresa}
                      required
                    />
                    <Input
                      label="RUC"
                      name="ruc"
                      value={empresaForm.ruc}
                      onChange={handleEmpresaInputChange}
                      error={empresaErrors.ruc}
                      disabled={!editingEmpresa}
                      maxLength={11}
                      required
                    />
                  </div>

                  <Input
                    label="Dirección"
                    name="direccion"
                    value={empresaForm.direccion}
                    onChange={handleEmpresaInputChange}
                    disabled={!editingEmpresa}
                  />

                  <div className="form-row">
                    <Input
                      label="Teléfono"
                      name="telefono"
                      value={empresaForm.telefono}
                      onChange={handleEmpresaInputChange}
                      disabled={!editingEmpresa}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={empresaForm.email}
                      onChange={handleEmpresaInputChange}
                      error={empresaErrors.email}
                      disabled={!editingEmpresa}
                      required
                    />
                  </div>

                  {editingEmpresa && (
                    <div className="form-actions">
                      <Button
                        variant="outline"
                        onClick={handleCancelEditEmpresa}
                        disabled={savingEmpresa}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        leftIcon={<FaSave />}
                        onClick={handleSaveEmpresa}
                        loading={savingEmpresa}
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Actual */}
              <div className="plan-info">
                <h3>Plan Actual</h3>
                <div className="plan-details">
                  <div className="plan-card">
                    <div className="plan-name">Plan {empresaData.plan}</div>
                    <div className="plan-stats">
                      <div className="stat">
                        <span className="stat-label">Usuarios</span>
                        <span className="stat-value">
                          {empresaData.usuarios_activos} / {empresaData.usuarios_max}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Almacenamiento</span>
                        <span className="stat-value">
                          {empresaData.almacenamiento_usado} / {empresaData.almacenamiento_max}
                        </span>
                      </div>
                    </div>
                    <Button variant="primary" className="upgrade-button">
                      Mejorar Plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* TAB: PROYECTOS */}
        {activeTab === 'proyectos' && (
          <>
            <Card className="proyectos-header-card">
              <div className="section-header">
                <div>
                  <h2>Proyectos</h2>
                  <p>Organiza tus reportes por proyectos específicos</p>
                </div>
                <Button
                  variant="primary"
                  leftIcon={<FaPlus />}
                  onClick={handleCreateProyecto}
                >
                  Nuevo Proyecto
                </Button>
              </div>
            </Card>

            <Card>
              <Table
                columns={proyectosColumns}
                data={proyectos}
                actions={renderProyectoActions}
                emptyMessage="No hay proyectos creados"
                pagination={true}
                itemsPerPage={10}
                sortable={true}
              />
            </Card>
          </>
        )}

        {/* TAB: GENERAL */}
        {activeTab === 'general' && (
          <Card>
            <div className="general-section">
              <h2>Configuración General</h2>
              <p className="section-description">
                Ajustes generales del sistema (próximamente)
              </p>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Notificaciones por Email</h4>
                    <p>Recibe alertas de reportes pendientes</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Validación Automática GPS</h4>
                    <p>Rechazar reportes con precisión mayor a 10m</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Backup Automático</h4>
                    <p>Respaldar datos diariamente</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modal Crear Proyecto */}
      <Modal
        isOpen={isCreateProyectoOpen}
        onClose={() => !savingProyecto && setIsCreateProyectoOpen(false)}
        title="Crear Nuevo Proyecto"
        size="medium"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nombre del Proyecto"
            name="nombre"
            value={proyectoForm.nombre}
            onChange={handleProyectoInputChange}
            error={proyectoErrors.nombre}
            placeholder="Ej: Expansión Red Norte 2025"
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Descripción *</label>
            <textarea
              name="descripcion"
              value={proyectoForm.descripcion}
              onChange={handleProyectoInputChange}
              placeholder="Describe el objetivo del proyecto..."
              rows={4}
              style={{
                padding: '12px',
                border: proyectoErrors.descripcion ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            {proyectoErrors.descripcion && (
              <span style={{ fontSize: '12px', color: '#dc3545' }}>{proyectoErrors.descripcion}</span>
            )}
          </div>

          <div className="form-row">
            <Input
              label="Fecha de Inicio"
              name="fecha_inicio"
              type="date"
              value={proyectoForm.fecha_inicio}
              onChange={handleProyectoInputChange}
              error={proyectoErrors.fecha_inicio}
              required
            />
            <Input
              label="Fecha de Fin"
              name="fecha_fin"
              type="date"
              value={proyectoForm.fecha_fin}
              onChange={handleProyectoInputChange}
              error={proyectoErrors.fecha_fin}
              required
            />
          </div>
        </div>

        <Modal.Footer
          onCancel={() => setIsCreateProyectoOpen(false)}
          onConfirm={handleSaveCreateProyecto}
          confirmText="Crear Proyecto"
          confirmLoading={savingProyecto}
        />
      </Modal>

      {/* Modal Editar Proyecto */}
      <Modal
        isOpen={isEditProyectoOpen}
        onClose={() => !savingProyecto && setIsEditProyectoOpen(false)}
        title="Editar Proyecto"
        size="medium"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nombre del Proyecto"
            name="nombre"
            value={proyectoForm.nombre}
            onChange={handleProyectoInputChange}
            error={proyectoErrors.nombre}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Descripción *</label>
            <textarea
              name="descripcion"
              value={proyectoForm.descripcion}
              onChange={handleProyectoInputChange}
              rows={4}
              style={{
                padding: '12px',
                border: proyectoErrors.descripcion ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            {proyectoErrors.descripcion && (
              <span style={{ fontSize: '12px', color: '#dc3545' }}>{proyectoErrors.descripcion}</span>
            )}
          </div>

          <div className="form-row">
            <Input
              label="Fecha de Inicio"
              name="fecha_inicio"
              type="date"
              value={proyectoForm.fecha_inicio}
              onChange={handleProyectoInputChange}
              error={proyectoErrors.fecha_inicio}
              required
            />
            <Input
              label="Fecha de Fin"
              name="fecha_fin"
              type="date"
              value={proyectoForm.fecha_fin}
              onChange={handleProyectoInputChange}
              error={proyectoErrors.fecha_fin}
              required
            />
          </div>
        </div>

        <Modal.Footer
          onCancel={() => setIsEditProyectoOpen(false)}
          onConfirm={handleSaveEditProyecto}
          confirmText="Guardar Cambios"
          confirmLoading={savingProyecto}
        />
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, proyecto: null })}
        onConfirm={handleConfirmDeleteProyecto}
        title="¿Eliminar Proyecto?"
        message={`¿Estás seguro de eliminar "${confirmDialog.proyecto?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        loading={savingProyecto}
      />
    </div>
  );
};

export default Configuracion;