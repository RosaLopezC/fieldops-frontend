import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ← AGREGAR IMPORT
import superadminService from '../../services/superadminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminsLocales.scss';

const AdminsLocales = () => {
  const navigate = useNavigate(); // ← AGREGAR HOOK
  const [admins, setAdmins] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    empresa_id: '',
    password: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Verificar que haya token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      const [adminsRes, empresasRes] = await Promise.all([
        superadminService.getAdminsLocales(),
        superadminService.getEmpresas()
      ]);
      
      setAdmins(adminsRes.data);
      setEmpresas(empresasRes.data.filter(e => e.estado === 'activa'));
    } catch (error) {
      console.error('Error al cargar datos:', error);
      
      // Si es error 401, redirigir al login
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        alert('Error al cargar datos: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('¿Estás seguro de eliminar este admin local? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      await superadminService.deleteAdminLocal(adminId);
      loadData(); // Recargar lista
    } catch (error) {
      console.error('Error al eliminar admin:', error);
      alert('Error al eliminar el admin local: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        dni: admin.dni,
        nombres: admin.nombres,
        apellidos: admin.apellidos,
        email: admin.email,
        celular: admin.celular || '',
        empresa_id: admin.empresa_id,
        password: ''
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        dni: '',
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        empresa_id: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      celular: '',
      empresa_id: '',
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Encontrar el nombre de la empresa
      const empresa = empresas.find(e => e.id === parseInt(formData.empresa_id));
      
      const adminData = {
        dni: formData.dni,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        celular: formData.celular,
        empresa_id: formData.empresa_id,
        empresa_nombre: empresa?.nombre || '',
        password: formData.password
      };

      if (editingAdmin) {
        // Actualizar
        await superadminService.updateAdminLocal(editingAdmin.id, adminData);
      } else {
        // Crear
        await superadminService.createAdminLocal(adminData);
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error al guardar admin:', error);
      alert('Error al guardar: ' + error.message);
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

  return (
    <div className="admins-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Administradores Locales</h1>
          <p>Gestiona los administradores de cada empresa</p>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Admin Local
        </Button>
      </div>

      {/* Tabla de admins */}
      <Card>
        {loading && admins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando administradores...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="admins-table">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Email</th>
                  <th>Celular</th>
                  <th>Empresa</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.dni}</td>
                    <td>{admin.nombres}</td>
                    <td>{admin.apellidos}</td>
                    <td>{admin.email}</td>
                    <td>{admin.celular}</td>
                    <td>
                      <span className="empresa-badge">
                        {admin.empresa_nombre}
                      </span>
                    </td>
                    <td>
                      <Badge 
                        variant={admin.estado === 'activo' ? 'success' : 'secondary'}
                      >
                        {admin.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          size="small"
                          variant="outline"
                          icon={<FaEdit />}
                          onClick={() => handleOpenModal(admin)}
                          title="Editar"
                        />
                        <Button
                          size="small"
                          variant="danger"
                          icon={<FaTrash />}
                          onClick={() => handleDelete(admin.id)}
                          title="Eliminar"
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

      {/* Modal para crear/editar admin */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAdmin ? 'Editar Admin Local' : 'Nuevo Admin Local'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
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
              required
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
            <label className="input-label">Empresa</label>
            <select
              name="empresa_id"
              value={formData.empresa_id}
              onChange={handleInputChange}
              required
              className="select-input"
            >
              <option value="">Seleccione una empresa</option>
              {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <Input
              label={editingAdmin ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingAdmin}
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
              {loading ? 'Guardando...' : editingAdmin ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminsLocales;