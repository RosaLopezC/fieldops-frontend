import React, { useState, useEffect } from 'react';
import superadminService from '../../services/superadminService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import AlertModal from '../../components/common/AlertModal'; // ← AGREGAR
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaSearch,
  FaCalendarAlt,
  FaDatabase,
  FaCreditCard
} from 'react-icons/fa';
import './Empresas.scss';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [viewingEmpresa, setViewingEmpresa] = useState(null);
  const [deletingEmpresa, setDeletingEmpresa] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para AlertModal
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: 'success',
    message: '',
    title: ''
  });

  // ← VERIFICA QUE ESTÉ ESTE ESTADO
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
    admin_local: '',
    admin_email: '',
    plan_id: '',
    meses_contrato: 1,
    fecha_inicio: new Date().toISOString().split('T')[0]
  });

  const showAlertMessage = (variant, message, title = '') => {
    setAlertConfig({ variant, message, title });
    setShowAlert(true);
  };

  useEffect(() => {
    loadEmpresas();
    loadPlanes();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getEmpresas();
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
      alert('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const loadPlanes = async () => {
    try {
      const response = await superadminService.getPlanes();
      setPlanes(response.data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    }
  };

  const handleCreate = () => {
    setEditingEmpresa(null);
    setFormData({
      nombre: '',
      ruc: '',
      direccion: '',
      telefono: '',
      email: '',
      admin_local: '',
      admin_email: '',
      plan_id: planes.length > 0 ? planes[0].id : '',
      meses_contrato: 1,
      fecha_inicio: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEdit = (empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      nombre: empresa.nombre,
      ruc: empresa.ruc,
      direccion: empresa.direccion,
      telefono: empresa.telefono,
      email: empresa.email,
      admin_local: empresa.admin_local,
      admin_email: empresa.admin_email,
      plan_id: empresa.plan_id,
      meses_contrato: 1,
      fecha_inicio: empresa.fecha_inicio
    });
    setShowModal(true);
  };

  const handleView = (empresa) => {
    setViewingEmpresa(empresa);
    setShowViewModal(true);
  };

  const handleDeleteClick = (empresa) => {
    setDeletingEmpresa(empresa);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingEmpresa) {
        await superadminService.updateEmpresa(editingEmpresa.id, formData);
        showAlertMessage('success', 'La empresa se actualizó correctamente');
      } else {
        await superadminService.createEmpresa(formData);
        showAlertMessage('success', 'La empresa se creó exitosamente');
      }
      
      setShowModal(false);
      loadEmpresas();
    } catch (error) {
      console.error('Error al guardar:', error);
      showAlertMessage('error', 'Ocurrió un error al guardar la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await superadminService.deleteEmpresa(deletingEmpresa.id);
      showAlertMessage('success', 'La empresa se eliminó correctamente');
      setShowDeleteModal(false);
      setDeletingEmpresa(null);
      loadEmpresas();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showAlertMessage('error', 'Ocurrió un error al eliminar la empresa');
    }
  };

  const handleToggleEstado = async (empresa) => {
    try {
      const nuevoEstado = empresa.estado === 'activa' ? 'inactiva' : 'activa';
      await superadminService.updateEmpresa(empresa.id, { estado: nuevoEstado });
      showAlertMessage(
        'success', 
        `La empresa se ${nuevoEstado === 'activa' ? 'activó' : 'desactivó'} correctamente`
      );
      loadEmpresas();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showAlertMessage('error', 'Ocurrió un error al cambiar el estado');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getEstadoBadge = (diasRestantes, estado) => {
    if (estado === 'inactiva') return 'secondary';
    if (diasRestantes < 0) return 'danger';
    if (diasRestantes <= 7) return 'warning';
    return 'success';
  };

  const getEstadoTexto = (diasRestantes, estado) => {
    if (estado === 'inactiva') return 'Inactiva';
    if (diasRestantes < 0) return 'Vencida';
    if (diasRestantes <= 7) return 'Por vencer';
    return 'Activa';
  };

  const getStorageBadge = (usado, plan) => {
    const porcentaje = (usado / plan) * 100;
    if (porcentaje >= 100) return 'danger';
    if (porcentaje >= 80) return 'warning';
    return 'success';
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.ruc.includes(searchTerm) ||
    empresa.admin_local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableColumns = [
    { 
      accessor: 'nombre', 
      header: 'Empresa',
      render: (value, row) => (
        <div>
          <strong>{value}</strong>
          <br />
          <small style={{ color: '#666' }}>{row.direccion}</small>
        </div>
      )
    },
    { accessor: 'ruc', header: 'RUC' },
    { 
      accessor: 'plan_nombre', 
      header: 'Plan',
      render: (value, row) => (
        <div>
          <Badge variant="primary">{value}</Badge>
          <br />
          <small style={{ color: '#666' }}>
            {row.storage_usado_gb.toFixed(1)} / {row.storage_plan_gb} GB
          </small>
        </div>
      )
    },
    { 
      accessor: 'dias_restantes', 
      header: 'Vigencia',
      render: (value, row) => (
        <div>
          <Badge variant={getEstadoBadge(value, row.estado)}>
            {getEstadoTexto(value, row.estado)}
          </Badge>
          <br />
          <small style={{ color: value < 0 ? '#dc3545' : '#666' }}>
            {value >= 0 ? `${value} días` : `Venció hace ${Math.abs(value)} días`}
          </small>
        </div>
      )
    },
    { 
      accessor: 'admin_local', 
      header: 'Admin Local',
      render: (value, row) => (
        <div>
          <strong>{value}</strong>
          <br />
          <small style={{ color: '#666' }}>{row.admin_email}</small>
        </div>
      )
    },
    { 
      accessor: 'usuarios', 
      header: 'Usuarios',
      width: '80px',
      render: (value) => <Badge variant="info">{value}</Badge>
    },
    { 
      accessor: 'reportes', 
      header: 'Reportes',
      width: '80px',
      render: (value) => <Badge variant="info">{value}</Badge>
    },
    { 
      accessor: 'actions',
      header: 'Acciones',
      width: '200px',
      render: (_, empresa) => (
        <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="small"
            variant="outline"
            icon={<FaEye />}
            onClick={(e) => {
              e.stopPropagation();
              handleView(empresa);
            }}
            title="Ver detalles"
          />
          <Button
            size="small"
            variant="outline"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(empresa);
            }}
            title="Editar"
          />
          <Button
            size="small"
            variant={empresa.estado === 'activa' ? 'success' : 'secondary'}
            icon={empresa.estado === 'activa' ? <FaToggleOn /> : <FaToggleOff />}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleEstado(empresa);
            }}
            title={empresa.estado === 'activa' ? 'Desactivar' : 'Activar'}
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={(e) => {
              e.stopPropagation(); // ← IMPORTANTE
              handleDeleteClick(empresa);
            }}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  const selectedPlan = planes.find(p => p.id === parseInt(formData.plan_id));

  return (
    <div className="empresas-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Empresas</h1>
          <p>Administra las empresas registradas en el sistema</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={handleCreate}
        >
          Nueva Empresa
        </Button>
      </div>

      <Card>
        <div className="search-section">
          <Input
            icon={<FaSearch />}
            placeholder="Buscar por nombre, RUC o admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table
          columns={tableColumns}
          data={filteredEmpresas}
          loading={loading}
          emptyMessage="No hay empresas registradas"
        />
      </Card>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
      >
        <form onSubmit={handleSubmit} className="empresa-form">
          <div className="form-section">
            <h3>📋 Información de la Empresa</h3>
            <div className="form-grid">
              <Input
                label="Nombre de la Empresa"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Ej: TeleCorp S.A."
              />
              <Input
                label="RUC"
                name="ruc"
                value={formData.ruc}
                onChange={handleInputChange}
                required
                maxLength={11}
                placeholder="20123456789"
              />
            </div>

            <Input
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              placeholder="Av. Principal 123, Lima"
            />

            <div className="form-grid">
              <Input
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                placeholder="987654321"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="contacto@empresa.com"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>👤 Admin Local</h3>
            <div className="form-grid">
              <Input
                label="Nombre del Admin"
                name="admin_local"
                value={formData.admin_local}
                onChange={handleInputChange}
                required
                placeholder="Ej: Juan Pérez"
              />
              <Input
                label="Email del Admin"
                name="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={handleInputChange}
                required
                placeholder="admin@empresa.com"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>💳 Plan y Vigencia</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Plan Contratado *</label>
                <select
                  name="plan_id"
                  value={formData.plan_id}
                  onChange={handleInputChange}
                  required
                  className="select-input"
                >
                  <option value="">Selecciona un plan</option>
                  {planes.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombre} - {plan.storage_gb}GB - S/. {plan.precio_mensual}/mes
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Duración (meses)"
                name="meses_contrato"
                type="number"
                min="1"
                max="12"
                value={formData.meses_contrato}
                onChange={handleInputChange}
                required
              />
            </div>

            {selectedPlan && (
              <div className="plan-summary">
                <h4>📊 Resumen del Plan</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Almacenamiento:</span>
                    <span className="value">{selectedPlan.storage_gb} GB</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Precio mensual:</span>
                    <span className="value">S/. {selectedPlan.precio_mensual}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">GB Extra:</span>
                    <span className="value">S/. {selectedPlan.precio_gb_extra}/GB</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Total a pagar:</span>
                    <span className="value highlight">
                      S/. {(selectedPlan.precio_mensual * formData.meses_contrato).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Fecha de Inicio"
              name="fecha_inicio"
              type="date"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (editingEmpresa ? 'Actualizar' : 'Crear Empresa')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detalles de la Empresa"
        size="large"
      >
        {viewingEmpresa && (
          <div className="empresa-details">
            <div className="details-header">
              <div className="company-info">
                <h2>{viewingEmpresa.nombre}</h2>
                <Badge variant={getEstadoBadge(viewingEmpresa.dias_restantes, viewingEmpresa.estado)}>
                  {getEstadoTexto(viewingEmpresa.dias_restantes, viewingEmpresa.estado)}
                </Badge>
              </div>
              <div className="company-meta">
                <span className="meta-item">
                  <FaCalendarAlt />
                  Creada: {viewingEmpresa.fecha_creacion}
                </span>
              </div>
            </div>

            <div className="details-grid">
              {/* Información General */}
              <div className="detail-section">
                <h3>📋 Información General</h3>
                <div className="detail-item">
                  <span className="label">RUC:</span>
                  <span className="value">{viewingEmpresa.ruc}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Dirección:</span>
                  <span className="value">{viewingEmpresa.direccion}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Teléfono:</span>
                  <span className="value">{viewingEmpresa.telefono}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{viewingEmpresa.email}</span>
                </div>
              </div>

              {/* Admin Local */}
              <div className="detail-section">
                <h3>👤 Administrador Local</h3>
                <div className="detail-item">
                  <span className="label">Nombre:</span>
                  <span className="value">{viewingEmpresa.admin_local}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{viewingEmpresa.admin_email}</span>
                </div>
              </div>

              {/* Plan y Facturación */}
              <div className="detail-section">
                <h3>💳 Plan Contratado</h3>
                <div className="detail-item">
                  <span className="label">Plan:</span>
                  <span className="value">
                    <Badge variant="primary">{viewingEmpresa.plan_nombre}</Badge>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Precio mensual:</span>
                  <span className="value">S/. {viewingEmpresa.precio_mensual}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Precio GB extra:</span>
                  <span className="value">S/. {viewingEmpresa.precio_gb_extra}/GB</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fecha inicio:</span>
                  <span className="value">{viewingEmpresa.fecha_inicio}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fecha vencimiento:</span>
                  <span className="value">{viewingEmpresa.fecha_fin}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Días restantes:</span>
                  <span className={`value ${viewingEmpresa.dias_restantes < 0 ? 'text-danger' : ''}`}>
                    {viewingEmpresa.dias_restantes >= 0 
                      ? `${viewingEmpresa.dias_restantes} días` 
                      : `Venció hace ${Math.abs(viewingEmpresa.dias_restantes)} días`}
                  </span>
                </div>
              </div>

              {/* Almacenamiento */}
              <div className="detail-section">
                <h3>💾 Almacenamiento</h3>
                <div className="storage-info">
                  <div className="storage-bar">
                    <div 
                      className="storage-progress"
                      style={{ 
                        width: `${Math.min((viewingEmpresa.storage_usado_gb / viewingEmpresa.storage_plan_gb) * 100, 100)}%`,
                        backgroundColor: viewingEmpresa.storage_usado_gb > viewingEmpresa.storage_plan_gb ? '#dc3545' : '#0066cc'
                      }}
                    />
                  </div>
                  <div className="storage-text">
                    {viewingEmpresa.storage_usado_gb.toFixed(1)} GB / {viewingEmpresa.storage_plan_gb} GB
                  </div>
                </div>
                
                {viewingEmpresa.storage_usado_gb > viewingEmpresa.storage_plan_gb && (
                  <div className="alert alert-warning">
                    <strong>⚠️ Almacenamiento Excedido</strong>
                    <br />
                    Ha excedido en {(viewingEmpresa.storage_usado_gb - viewingEmpresa.storage_plan_gb).toFixed(1)} GB
                    <br />
                    Costo adicional: S/. {((viewingEmpresa.storage_usado_gb - viewingEmpresa.storage_plan_gb) * viewingEmpresa.precio_gb_extra).toFixed(2)}
                  </div>
                )}

                <div className="detail-item">
                  <span className="label">Pago confirmado:</span>
                  <span className="value">
                    <Badge variant={viewingEmpresa.pago_confirmado ? 'success' : 'warning'}>
                      {viewingEmpresa.pago_confirmado ? '✓ Sí' : '⏳ Pendiente'}
                    </Badge>
                  </span>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="detail-section">
                <h3>📊 Estadísticas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{viewingEmpresa.usuarios}</div>
                    <div className="stat-label">Usuarios</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{viewingEmpresa.reportes}</div>
                    <div className="stat-label">Reportes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="details-actions">
              {viewingEmpresa.dias_restantes < 0 && (
                <Button
                  variant="success"
                  icon={<FaCreditCard />}
                  onClick={async () => {
                    try {
                      await superadminService.renovarEmpresa(viewingEmpresa.id, 1);
                      alert('✅ Empresa renovada por 1 mes');
                      setShowViewModal(false);
                      loadEmpresas();
                    } catch (error) {
                      alert('Error al renovar empresa');
                    }
                  }}
                >
                  Renovar 1 Mes
                </Button>
              )}
              
              {viewingEmpresa.storage_usado_gb > viewingEmpresa.storage_plan_gb && !viewingEmpresa.pago_confirmado && (
                <Button
                  variant="primary"
                  icon={<FaCreditCard />}
                  onClick={async () => {
                    try {
                      await superadminService.confirmarPagoExtra(viewingEmpresa.id);
                      alert('✅ Pago extra confirmado');
                      setShowViewModal(false);
                      loadEmpresas();
                    } catch (error) {
                      alert('Error al confirmar pago');
                    }
                  }}
                >
                  Confirmar Pago Extra
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setShowViewModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Empresa"
        message={
          deletingEmpresa && (
            <>
              ¿Estás seguro de eliminar la empresa <strong>{deletingEmpresa.nombre}</strong>?
              <br /><br />
              Esta acción no se puede deshacer y se eliminarán:
              <ul style={{ textAlign: 'left', marginTop: '10px' }}>
                <li>{deletingEmpresa.usuarios} usuarios</li>
                <li>{deletingEmpresa.reportes} reportes</li>
                <li>Todos los datos asociados</li>
              </ul>
            </>
          )
        }
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* ← AGREGAR ESTE MODAL */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        variant={alertConfig.variant}
        message={alertConfig.message}
        title={alertConfig.title}
        autoClose={true}
        autoCloseDelay={2500}
      />
    </div>
  );
};

export default Empresas;