import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService'; // ← CAMBIAR ESTE IMPORT
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Encargados.scss';

const AdminEncargados = () => {
  const [encargados, setEncargados] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEncargado, setEditingEncargado] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    supervisor: '',
    password: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [encargadosRes, supervisoresRes] = await Promise.all([
        adminService.getEncargados(), // ← CAMBIAR
        adminService.getSupervisors() // ← CAMBIAR
      ]);
      setEncargados(encargadosRes.data);
      setSupervisores(supervisoresRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (encargado = null) => {
    if (encargado) {
      setEditingEncargado(encargado);
      setFormData({
        dni: encargado.dni,
        nombres: encargado.nombres,
        apellidos: encargado.apellidos,
        email: encargado.email,
        celular: encargado.celular || '',
        supervisor: encargado.supervisor || '',
        password: ''
      });
    } else {
      setEditingEncargado(null);
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        supervisor: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEncargado(null);
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      celular: '',
      supervisor: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const encargadoData = {
        ...formData,
        supervisor: parseInt(formData.supervisor)
      };
      
      if (editingEncargado) {
        await adminService.updateEncargado(editingEncargado.id, encargadoData); // ← CAMBIAR
      } else {
        await adminService.createEncargado(encargadoData); // ← CAMBIAR
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error al guardar encargado:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (encargadoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este encargado? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      await adminService.deleteEncargado(encargadoId); // ← CAMBIAR
      loadData();
    } catch (error) {
      console.error('Error al eliminar encargado:', error);
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

  const getSupervisorName = (supervisorId) => {
    const supervisor = supervisores.find(s => s.id === supervisorId);
    return supervisor ? `${supervisor.nombres} ${supervisor.apellidos}` : 'Sin asignar';
  };

  const tableColumns = [
    { 
      accessor: 'dni',  // ← CAMBIAR
      header: 'DNI',    // ← CAMBIAR
      width: '100px'
    },
    { 
      accessor: 'nombres', 
      header: 'Nombres',
      width: '130px'
    },
    { 
      accessor: 'apellidos', 
      header: 'Apellidos',
      width: '130px'
    },
    { 
      accessor: 'email', 
      header: 'Email',
      width: '180px'
    },
    { 
      accessor: 'celular', 
      header: 'Celular',
      width: '110px',
      render: (value) => value || 'No registrado'
    },
    {
      accessor: 'supervisor',
      header: 'Supervisor',
      width: '150px',
      render: (value) => getSupervisorName(value)
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
      render: (_, encargado) => (
        <div className="action-buttons">
          <Button
            size="small"
            variant="outline"
            icon={<FaEdit />}
            onClick={() => handleOpenModal(encargado)}
            title="Editar"
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={() => handleDelete(encargado.id)}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <div className="admin-encargados-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Encargados</h1>
          <p>Gestiona los encargados de tu empresa</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Encargado
        </Button>
      </div>

      {/* Tabla */}
      <Card>
        {loading && encargados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando encargados...</p>
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={encargados}
            emptyMessage="No hay encargados registrados"
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingEncargado ? 'Editar Encargado' : 'Nuevo Encargado'}
      >
        <form onSubmit={handleSubmit} className="encargado-form">
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
            <label className="input-label">Supervisor</label>
            <select
              name="supervisor"
              value={formData.supervisor}
              onChange={handleInputChange}
              required
              className="select-input"
            >
              <option value="">Seleccione un supervisor</option>
              {supervisores.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.nombres} {supervisor.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <Input
              label={editingEncargado ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingEncargado}
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
              {loading ? 'Guardando...' : editingEncargado ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEncargados;