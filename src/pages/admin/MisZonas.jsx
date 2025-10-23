import React, { useState, useEffect } from 'react';
import territorialService from '../../services/territorialService';
import { exportToExcel, exportToPDF, showExportModal } from '../../utils/exportUtils';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import { FaPlus, FaEdit, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import './MisZonas.scss';

const MisZonas = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingZona, setEditingZona] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: 'todos'
  });
  const [formData, setFormData] = useState({
    id: '',
    distrito: '',
    distrito_id: ''
  });

  useEffect(() => {
    loadZonas();
  }, []);

  const loadZonas = async () => {
    try {
      setLoading(true);
      const response = await territorialService.getZonas(filters);
      setZonas(response.data);
    } catch (error) {
      console.error('Error al cargar zonas:', error);
      alert('Error al cargar zonas: ' + error.message);
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
    loadZonas();
  };

  const handleDownload = async () => {
    try {
      const dataToExport = zonas.map(zona => ({
        'ID': zona.id,
        'Distrito': zona.distrito,
        'Sectores': `${zona.sectores} sectores`,
        'Supervisores': zona.supervisores || 0,
        'Encargados': zona.encargados || 0,
        'Estado': zona.estado === 'activo' ? 'Activo' : 'Inactivo'
      }));

      if (dataToExport.length === 0) {
        alert('⚠️ No hay datos para exportar');
        return;
      }

      await showExportModal(
        () => {
          try {
            exportToExcel(dataToExport, 'Zonas_FieldOps');
            alert('✅ Archivo Excel descargado exitosamente');
          } catch (error) {
            alert('❌ Error al exportar a Excel: ' + error.message);
          }
        },
        () => {
          try {
            exportToPDF(dataToExport, 'Zonas_FieldOps');
            alert('✅ Abriendo vista previa de impresión para PDF');
          } catch (error) {
            alert('❌ Error al exportar a PDF: ' + error.message);
          }
        }
      );
    } catch (error) {
      console.error('Error en exportación:', error);
      alert('Error al exportar: ' + error.message);
    }
  };

  const handleOpenModal = (zona = null) => {
    if (zona) {
      setEditingZona(zona);
      setFormData({
        id: zona.id,
        distrito: zona.distrito,
        distrito_id: zona.distrito_id
      });
    } else {
      setEditingZona(null);
      setFormData({
        id: '',
        distrito: '',
        distrito_id: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingZona(null);
    setFormData({
      id: '',
      distrito: '',
      distrito_id: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingZona) {
        await territorialService.updateZona(editingZona.id, formData);
      } else {
        await territorialService.createZona(formData);
      }
      
      handleCloseModal();
      loadZonas();
    } catch (error) {
      console.error('Error al guardar zona:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (zonaId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta zona? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      await territorialService.deleteZona(zonaId);
      loadZonas();
    } catch (error) {
      console.error('Error al eliminar zona:', error);
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
      width: '80px'
    },
    {
      accessor: 'distrito',
      header: 'Distrito',
      width: '200px'
    },
    {
      accessor: 'sectores',
      header: 'Sectores',
      width: '120px',
      render: (value) => `${value} sectores`
    },
    {
      accessor: 'personal_asignado',
      header: 'Personal Asignado',
      width: '220px'
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
      render: (_, zona) => (
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
            onClick={() => handleOpenModal(zona)}
            title="Editar"
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={() => handleDelete(zona.id)}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <div className="mis-zonas-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Mis Zonas</h1>
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
                  "Buscar zona..." // MisZonas
                  // "Buscar zona..." // MisSectores
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
            <p>Cargando zonas...</p>
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={zonas}
            emptyMessage="No hay zonas registradas"
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingZona ? 'Editar Zona' : 'Nueva Zona'}
      >
        <form onSubmit={handleSubmit} className="zona-form">
          <div className="form-row">
            <Input
              label="ID de Zona"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Ej: Z01"
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
              {loading ? 'Guardando...' : editingZona ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MisZonas;