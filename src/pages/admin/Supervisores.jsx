import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService'; // ← CAMBIAR ESTE IMPORT
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Supervisores.scss';

const AdminSupervisores = () => {
  const [supervisores, setSupervisores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    password: ''
  });

  useEffect(() => {
    loadSupervisores();
  }, []);

  const loadSupervisores = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSupervisors(); // ← CAMBIAR
      setSupervisores(response.data);
    } catch (error) {
      console.error('Error al cargar supervisores:', error);
      alert('Error al cargar supervisores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supervisor = null) => {
    if (supervisor) {
      setEditingSupervisor(supervisor);
      setFormData({
        dni: supervisor.dni,
        nombres: supervisor.nombres,
        apellidos: supervisor.apellidos,
        email: supervisor.email,
        celular: supervisor.celular || '',
        password: ''
      });
    } else {
      setEditingSupervisor(null);
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupervisor(null);
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      celular: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingSupervisor) {
        await adminService.updateSupervisor(editingSupervisor.id, formData); // ← CAMBIAR
      } else {
        await adminService.createSupervisor(formData); // ← CAMBIAR
      }
      
      handleCloseModal();
      loadSupervisores();
    } catch (error) {
      console.error('Error al guardar supervisor:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (supervisorId) => {
    if (!window.confirm('¿Estás seguro de eliminar este supervisor? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      await adminService.deleteSupervisor(supervisorId); // ← CAMBIAR
      loadSupervisores();
    } catch (error) {
      console.error('Error al eliminar supervisor:', error);
      alert('Error al eliminar: ' + error.message);
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

  const tableColumns = [
    { 
      accessor: 'dni',  // ← CAMBIAR de key a accessor
      header: 'DNI',    // ← CAMBIAR de label a header
      width: '100px'
    },
    { 
      accessor: 'nombres', 
      header: 'Nombres',
      width: '150px'
    },
    { 
      accessor: 'apellidos', 
      header: 'Apellidos',
      width: '150px'
    },
    { 
      accessor: 'email', 
      header: 'Email',
      width: '200px'
    },
    { 
      accessor: 'celular', 
      header: 'Celular',
      width: '120px',
      render: (value) => value || 'No registrado'
    },
    {
      accessor: 'estado',
      header: 'Estado',
      width: '100px',
      render: (value) => (
        <Badge variant={value === 'activo' ? 'success' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      width: '150px',
      render: (_, supervisor) => (
        <div className="action-buttons">
          <Button
            size="small"
            variant="outline"
            icon={<FaEdit />}
            onClick={() => handleOpenModal(supervisor)}
            title="Editar"
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={() => handleDelete(supervisor.id)}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <div className="admin-supervisores-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Supervisores</h1>
          <p>Gestiona los supervisores de tu empresa</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Supervisor
        </Button>
      </div>

      {/* Tabla */}
      <Card>
        {loading && supervisores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando supervisores...</p>
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={supervisores}
            emptyMessage="No hay supervisores registrados"
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingSupervisor ? 'Editar Supervisor' : 'Nuevo Supervisor'}
      >
        <form onSubmit={handleSubmit} className="supervisor-form">
          <div className="form-row-group">
            <Input
              label="DNI"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              required
              maxLength={8}
            />
            <Input
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              maxLength={9}
            />
          </div>

          <div className="form-row-group">
            <Input
              label="Nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </div>

          <div className="form-row">
            <Input
              label={editingSupervisor ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingSupervisor}
              fullWidth
            />
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : editingSupervisor ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSupervisores;