import React, { useState, useEffect } from 'react';
import superadminService from '../../services/superadminService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import AlertModal from '../../components/common/AlertModal';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaSearch,
  FaKey,
  FaBuilding,
  FaEnvelope
} from 'react-icons/fa';
import './AdminsLocales.scss';

const AdminsLocales = () => {
  const [admins, setAdmins] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [viewingAdmin, setViewingAdmin] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [resetPasswordAdmin, setResetPasswordAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: 'success',
    message: '',
    title: ''
  });
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa_id: ''
  });

  useEffect(() => {
    loadAdmins();
    loadEmpresas();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getAdminsLocales();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error al cargar admins:', error);
      showAlertMessage('error', 'Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  const loadEmpresas = async () => {
    try {
      const response = await superadminService.getEmpresas();
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  const showAlertMessage = (variant, message, title = '') => {
    setAlertConfig({ variant, message, title });
    setShowAlert(true);
  };

  const handleCreate = () => {
    setEditingAdmin(null);
    setFormData({
      nombre: '',
      email: '',
      empresa_id: empresas.length > 0 ? empresas[0].id : ''
    });
    setShowModal(true);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      nombre: admin.nombre,
      email: admin.email,
      empresa_id: admin.empresa_id
    });
    setShowModal(true);
  };

  const handleView = (admin) => {
    setViewingAdmin(admin);
    setShowViewModal(true);
  };

  const handleDeleteClick = (admin) => {
    setDeletingAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await superadminService.deleteAdminLocal(deletingAdmin.id);
      showAlertMessage('success', 'Administrador eliminado correctamente');
      setShowDeleteModal(false);
      setDeletingAdmin(null);
      loadAdmins();
    } catch (error) {
      console.error('Error al eliminar:', error);
      showAlertMessage('error', 'Error al eliminar administrador');
    }
  };

  const handleResetPasswordClick = (admin) => {
    setResetPasswordAdmin(admin);
    setShowPasswordModal(true);
  };

  const handleResetPassword = async () => {
    try {
      const response = await superadminService.resetPasswordAdmin(resetPasswordAdmin.id);
      setNewPassword(response.new_password);
      showAlertMessage('success', 'Contraseña reseteada exitosamente');
      setShowPasswordModal(false);
      
      // Mostrar nueva contraseña
      alert(`Nueva contraseña para ${resetPasswordAdmin.email}:\n\n${response.new_password}\n\nEnvía esta contraseña al administrador de forma segura.`);
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      showAlertMessage('error', 'Error al resetear contraseña');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingAdmin) {
        await superadminService.updateAdminLocal(editingAdmin.id, formData);
        showAlertMessage('success', 'Administrador actualizado correctamente');
      } else {
        await superadminService.createAdminLocal(formData);
        showAlertMessage('success', 'Administrador creado exitosamente');
      }
      
      setShowModal(false);
      loadAdmins();
    } catch (error) {
      console.error('Error al guardar:', error);
      showAlertMessage('error', 'Error al guardar administrador');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredAdmins = admins.filter(admin =>
    admin.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.empresa_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableColumns = [
    { 
      accessor: 'nombre', 
      header: 'Administrador',
      render: (value, row) => (
        <div>
          <strong>{value}</strong>
          <br />
          <small style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaEnvelope size={12} /> {row.email}
          </small>
        </div>
      )
    },
    { 
      accessor: 'empresa_nombre', 
      header: 'Empresa',
      render: (value, row) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaBuilding style={{ color: '#0066cc' }} />
            <strong>{value}</strong>
          </div>
          <small style={{ color: '#666' }}>RUC: {row.empresa_ruc}</small>
        </div>
      )
    },
    { 
      accessor: 'usuarios', 
      header: 'Usuarios',
      width: '100px',
      render: (value) => <Badge variant="info">{value}</Badge>
    },
    { 
      accessor: 'reportes', 
      header: 'Reportes',
      width: '100px',
      render: (value) => <Badge variant="info">{value}</Badge>
    },
    { 
      accessor: 'estado', 
      header: 'Estado',
      width: '120px',
      render: (value) => (
        <Badge variant={value === 'activa' ? 'success' : 'secondary'}>
          {value === 'activa' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    { 
      accessor: 'actions', 
      header: 'Acciones',
      width: '220px',
      render: (_, admin) => (
        <div className="action-buttons">
          <Button
            size="small"
            variant="outline"
            icon={<FaEye />}
            onClick={(e) => {
              e.stopPropagation();
              handleView(admin);
            }}
            title="Ver detalles"
          />
          <Button
            size="small"
            variant="outline"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(admin);
            }}
            title="Editar"
          />
          <Button
            size="small"
            variant="warning"
            icon={<FaKey />}
            onClick={(e) => {
              e.stopPropagation();
              handleResetPasswordClick(admin);
            }}
            title="Resetear contraseña"
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(admin);
            }}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <div className="admins-locales-page">
      <div className="page-header">
        <div>
          <h1>Admins Locales</h1>
          <p>Gestiona los administradores de cada empresa</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={handleCreate}
        >
          Nuevo Admin
        </Button>
      </div>

      <Card>
        <div className="search-section">
          <Input
            icon={<FaSearch />}
            placeholder="Buscar por nombre, email o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table
          columns={tableColumns}
          data={filteredAdmins}
          loading={loading}
          emptyMessage="No hay administradores registrados"
        />
      </Card>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAdmin ? 'Editar Administrador' : 'Nuevo Administrador'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h3>👤 Información del Administrador</h3>
            
            <Input
              label="Nombre Completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ej: Juan Pérez"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="admin@empresa.com"
            />

            <div className="form-group">
              <label>Empresa Asignada *</label>
              <select
                name="empresa_id"
                value={formData.empresa_id}
                onChange={handleInputChange}
                required
                className="select-input"
              >
                <option value="">Selecciona una empresa</option>
                {empresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre} (RUC: {empresa.ruc})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!editingAdmin && (
            <div className="info-box">
              <h4>ℹ️ Información Importante</h4>
              <ul>
                <li>Se generará una contraseña temporal automáticamente</li>
                <li>El administrador recibirá un email con sus credenciales</li>
                <li>Deberá cambiar su contraseña en el primer inicio de sesión</li>
              </ul>
            </div>
          )}

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
              {loading ? 'Guardando...' : (editingAdmin ? 'Actualizar' : 'Crear Admin')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Ver Detalles */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detalles del Administrador"
      >
        {viewingAdmin && (
          <div className="admin-details">
            <div className="details-header">
              <div className="admin-info">
                <h2>{viewingAdmin.nombre}</h2>
                <Badge variant={viewingAdmin.estado === 'activa' ? 'success' : 'secondary'}>
                  {viewingAdmin.estado === 'activa' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>

            <div className="details-grid">
              {/* Información Personal */}
              <div className="detail-section">
                <h3>👤 Información Personal</h3>
                <div className="detail-item">
                  <span className="label">Nombre:</span>
                  <span className="value">{viewingAdmin.nombre}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{viewingAdmin.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Fecha de creación:</span>
                  <span className="value">{viewingAdmin.fecha_creacion}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Último acceso:</span>
                  <span className="value">{viewingAdmin.ultimo_acceso || 'Nunca'}</span>
                </div>
              </div>

              {/* Empresa Asignada */}
              <div className="detail-section">
                <h3>🏢 Empresa Asignada</h3>
                <div className="detail-item">
                  <span className="label">Nombre:</span>
                  <span className="value">{viewingAdmin.empresa_nombre}</span>
                </div>
                <div className="detail-item">
                  <span className="label">RUC:</span>
                  <span className="value">{viewingAdmin.empresa_ruc}</span>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="detail-section full-width">
                <h3>📊 Estadísticas de la Empresa</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{viewingAdmin.usuarios}</div>
                    <div className="stat-label">Usuarios</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{viewingAdmin.reportes}</div>
                    <div className="stat-label">Reportes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-actions">
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
        title="Eliminar Administrador"
        message={
          deletingAdmin && (
            <>
              ¿Estás seguro de eliminar al administrador <strong>{deletingAdmin.nombre}</strong>?
              <br /><br />
              ⚠️ La empresa <strong>{deletingAdmin.empresa_nombre}</strong> quedará sin administrador asignado.
              <br /><br />
              Tendrás que asignar un nuevo administrador posteriormente.
            </>
          )
        }
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Modal Confirmar Reset de Contraseña */}
      <ConfirmModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleResetPassword}
        title="Resetear Contraseña"
        message={
          resetPasswordAdmin && (
            <>
              ¿Estás seguro de resetear la contraseña de <strong>{resetPasswordAdmin.nombre}</strong>?
              <br /><br />
              Se generará una nueva contraseña temporal que deberás enviar al administrador.
              <br /><br />
              📧 Email: {resetPasswordAdmin.email}
            </>
          )
        }
        confirmText="Sí, Resetear"
        cancelText="Cancelar"
        variant="warning"
      />

      {/* AlertModal */}
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

export default AdminsLocales;