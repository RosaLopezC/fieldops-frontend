import React, { useState, useEffect } from 'react';
import territorialService from '../../services/territorialService';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import { FaPlus, FaEdit, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import './MisSectores.scss';

const MisSectores = () => {
  const [sectores, setSectores] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: 'todos'
  });
  const [formData, setFormData] = useState({
    id: '',
    distrito: '',
    zona: '',
    supervisor_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sectoresRes, supervisoresRes] = await Promise.all([
        territorialService.getSectores(filters),
        adminService.getSupervisors()
      ]);
      setSectores(sectoresRes.data);
      setSupervisores(supervisoresRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSectores = async () => {
    try {
      setLoading(true);
      const response = await territorialService.getSectores(filters);
      setSectores(response.data);
    } catch (error) {
      console.error('Error al cargar sectores:', error);
      alert('Error al cargar sectores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    loadSectores();
  };

  const handleDownload = () => {
    alert('Funcionalidad de descarga en desarrollo');
  };

  const handleOpenModal = (sector = null) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({
        id: sector.id,
        distrito: sector.distrito,
        zona: sector.zona,
        supervisor_id: sector.supervisor_id
      });
    } else {
      setEditingSector(null);
      setFormData({
        id: '',
        distrito: '',
        zona: '',
        supervisor_id: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSector(null);
    setFormData({
      id: '',
      distrito: '',
      zona: '',
      supervisor_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Encontrar nombre del supervisor
      const supervisor = supervisores.find(s => s.id === parseInt(formData.supervisor_id));
      const sectorData = {
        ...formData,
        supervisor_asignado: supervisor ? `${supervisor.nombres} ${supervisor.apellidos}` : ''
      };
      
      if (editingSector) {
        await territorialService.updateSector(editingSector.id, sectorData);
      } else {
        await territorialService.createSector(sectorData);
      }
      
      handleCloseModal();
      loadSectores();
    } catch (error) {
      console.error('Error al guardar sector:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sectorId) => {
    if (!window.confirm('¿Estás seguro de eliminar este sector? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      await territorialService.deleteSector(sectorId);
      loadSectores();
    } catch (error) {
      console.error('Error al eliminar sector:', error);
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
      accessor: 'id',
      header: 'ID',
      width: '100px'
    },
    {
      accessor: 'distrito',
      header: 'Distrito',
      width: '180px'
    },
    {
      accessor: 'zona',
      header: 'Zona',
      width: '100px'
    },
    {
      accessor: 'supervisor_asignado',
      header: 'Supervisor Asignado',
      width: '200px'
    },
    {
      accessor: 'encargados',
      header: 'Encargados',
      width: '120px',
      render: (value) => `${value} encargados`
    },
    {
      accessor: 'estado',
      header: 'Estado',
      width: '100px',
      render: (value) => (
        <Badge variant={value === 'activo' ? 'success' : 'secondary'}>
          {value === 'activo' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      accessor: 'actions',
      header: 'Acciones',
      width: '180px',
      render: (_, sector) => (
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
            onClick={() => handleOpenModal(sector)}
            title="Editar"
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={() => handleDelete(sector.id)}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <div className="mis-sectores-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Mis Sectores</h1>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Distrito
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group filter-search">
              <Input
                label="Buscador"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={
                  // Cambiar según la vista
                  // "Buscar distrito..." // MisDistritos
                  "Buscar zona..." // MisSectores
                }
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Estado</label>
              <select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                className="select-input"
              >
                <option value="todos">Selecciona uno</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="filter-group">
              <Button
                variant="outline"
                onClick={handleFilter}
                disabled={loading}
              >
                Filtrar
              </Button>
            </div>

            <div className="filter-group">
              <Button
                variant="warning"
                icon={<FaDownload />}
                onClick={handleDownload}
              >
                Descargar xlsx
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando sectores...</p>
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={sectores}
            emptyMessage="No hay sectores registrados"
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingSector ? 'Editar Sector' : 'Nuevo Sector'}
      >
        <form onSubmit={handleSubmit} className="sector-form">
          <div className="form-row">
            <Input
              label="ID de Sector"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Ej: Z01S01"
            />
          </div>

          <div className="form-row">
            <Input
              label="Distrito"
              name="distrito"
              value={formData.distrito}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Ej: San Isidro"
            />
          </div>

          <div className="form-row">
            <Input
              label="Zona"
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Ej: Z01"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Supervisor Asignado</label>
            <select
              name="supervisor_id"
              value={formData.supervisor_id}
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
              {loading ? 'Guardando...' : editingSector ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MisSectores;