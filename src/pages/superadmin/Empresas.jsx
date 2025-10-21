import React, { useState, useEffect } from 'react';
import superadminService from '../../services/superadminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { 
  FaPlus, 
  FaEdit, 
  FaToggleOn, 
  FaToggleOff,
  FaEye 
} from 'react-icons/fa';
import './Empresas.scss';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
    admin_local: ''
  });

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getEmpresas();
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (empresa = null) => {
    if (empresa) {
      setEditingEmpresa(empresa);
      setFormData({
        nombre: empresa.nombre,
        ruc: empresa.ruc,
        direccion: empresa.direccion,
        telefono: empresa.telefono,
        email: empresa.email,
        admin_local: empresa.admin_local
      });
    } else {
      setEditingEmpresa(null);
      setFormData({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        email: '',
        admin_local: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmpresa(null);
    setFormData({
      nombre: '',
      ruc: '',
      direccion: '',
      telefono: '',
      email: '',
      admin_local: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingEmpresa) {
        await superadminService.updateEmpresa(editingEmpresa.id, formData);
      } else {
        await superadminService.createEmpresa(formData);
      }
      handleCloseModal();
      loadEmpresas();
    } catch (error) {
      console.error('Error al guardar empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEstado = async (empresaId) => {
    try {
      await superadminService.toggleEmpresaEstado(empresaId);
      loadEmpresas();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="empresas-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Gestión de Empresas</h1>
          <p>Administra las empresas registradas en el sistema</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal()}
        >
          Nueva Empresa
        </Button>
      </div>

      {/* Tabla de empresas */}
      <Card>
        {loading && empresas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando empresas...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="empresas-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>RUC</th>
                  <th>Contacto</th>
                  <th>Admin Local</th>
                  <th className="text-center">Usuarios</th>
                  <th className="text-center">Reportes</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td>
                      <div className="empresa-info">
                        <strong>{empresa.nombre}</strong>
                        <span className="empresa-direccion">{empresa.direccion}</span>
                      </div>
                    </td>
                    <td>{empresa.ruc}</td>
                    <td>
                      <div className="contacto-info">
                        <span>{empresa.email}</span>
                        <span className="telefono">{empresa.telefono}</span>
                      </div>
                    </td>
                    <td>{empresa.admin_local || 'Sin asignar'}</td>
                    <td className="text-center">
                      <span className="metric-badge">{empresa.usuarios_activos}</span>
                    </td>
                    <td className="text-center">
                      <span className="metric-badge">{empresa.reportes_totales}</span>
                    </td>
                    <td>
                      <Badge 
                        variant={empresa.estado === 'activa' ? 'success' : 'secondary'}
                      >
                        {empresa.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="small"
                          variant="outline"
                          icon={<FaEye />}
                          title="Ver detalles"
                        />
                        <Button
                          size="small"
                          variant="outline"
                          icon={<FaEdit />}
                          onClick={() => handleOpenModal(empresa)}
                          title="Editar"
                        />
                        <Button
                          size="small"
                          variant={empresa.estado === 'activa' ? 'danger' : 'success'}
                          icon={empresa.estado === 'activa' ? <FaToggleOff /> : <FaToggleOn />}
                          onClick={() => handleToggleEstado(empresa.id)}
                          title={empresa.estado === 'activa' ? 'Desactivar' : 'Activar'}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal para crear/editar empresa */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
      >
        <form onSubmit={handleSubmit} className="empresa-form">
          <div className="form-row">
            <Input
              label="Nombre de la Empresa"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </div>

          <div className="form-row">
            <Input
              label="RUC"
              name="ruc"
              value={formData.ruc}
              onChange={handleInputChange}
              required
              maxLength={11}
              fullWidth
            />
          </div>

          <div className="form-row">
            <Input
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </div>

          <div className="form-row-group">
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Nombre del Admin Local"
              name="admin_local"
              value={formData.admin_local}
              onChange={handleInputChange}
              placeholder="Ej: Juan Pérez"
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
              {loading ? 'Guardando...' : editingEmpresa ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Empresas;