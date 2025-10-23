import React, { useState, useEffect } from 'react';
import territorialService from '../../services/territorialService';
import { exportToExcel, exportToPDF, showExportModal } from '../../utils/exportUtils'; // ← AGREGAR
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import { FaPlus, FaEdit, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import './MisDistritos.scss';

const MisDistritos = () => {
  const [distritos, setDistritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDistrito, setEditingDistrito] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: 'todos'
  });
  const [formData, setFormData] = useState({
    nombre: ''
  });

  useEffect(() => {
    loadDistritos();
  }, []);

  const loadDistritos = async () => {
    try {
      setLoading(true);
      const response = await territorialService.getDistritos(filters);
      setDistritos(response.data);
    } catch (error) {
      console.error('Error al cargar distritos:', error);
      alert('Error al cargar distritos: ' + error.message);
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
    loadDistritos();
  };

  const handleDownload = async () => {
    try {
      // Preparar datos para exportación
      const dataToExport = distritos.map(distrito => ({
        'ID': distrito.id,
        'Nombre': distrito.nombre,
        'Zonas': `${distrito.zonas} zonas`,
        'Sectores': `${distrito.sectores} sectores`,
        'Supervisores': distrito.supervisores || 0,
        'Encargados': distrito.encargados || 0,
        'Estado': distrito.estado === 'activo' ? 'Activo' : 'Inactivo'
      }));

      if (dataToExport.length === 0) {
        alert('⚠️ No hay datos para exportar');
        return;
      }

      // Mostrar opciones de exportación
      await showExportModal(
        // Opción Excel
        () => {
          try {
            exportToExcel(dataToExport, 'Distritos_FieldOps');
            alert('✅ Archivo Excel descargado exitosamente');
          } catch (error) {
            alert('❌ Error al exportar a Excel: ' + error.message);
          }
        },
        // Opción PDF
        () => {
          try {
            exportToPDF(dataToExport, 'Distritos_FieldOps');
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

  const handleOpenModal = (distrito = null) => {
    if (distrito) {
      setEditingDistrito(distrito);
      setFormData({
        nombre: distrito.nombre
      });
    } else {
      setEditingDistrito(null);
      setFormData({
        nombre: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDistrito(null);
    setFormData({
      nombre: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingDistrito) {
        await territorialService.updateDistrito(editingDistrito.id, formData);
      } else {
        await territorialService.createDistrito(formData);
      }
      
      handleCloseModal();
      loadDistritos();
    } catch (error) {
      console.error('Error al guardar distrito:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (distritoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este distrito? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      await territorialService.deleteDistrito(distritoId);
      loadDistritos();
    } catch (error) {
      console.error('Error al eliminar distrito:', error);
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
      accessor: 'nombre',
      header: 'Nombre del Distrito',
      width: '200px'
    },
    {
      accessor: 'zonas',
      header: 'Zonas',
      width: '100px',
      render: (value) => `${value} zonas`
    },
    {
      accessor: 'sectores',
      header: 'Sectores',
      width: '100px',
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
      render: (_, distrito) => (
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
            onClick={() => handleOpenModal(distrito)}
            title="Editar"
          />
          <Button
            size="small"
            variant="danger"
            icon={<FaTrash />}
            onClick={() => handleDelete(distrito.id)}
            title="Eliminar"
          />
        </div>
      )
    }
  ];

  return (
    <div className="mis-distritos-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Mis Distritos</h1>
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
                  "Buscar distrito..." // MisDistritos
                  // "Buscar zona..." // MisZonas
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
            <p>Cargando distritos...</p>
          </div>
        ) : (
          <Table
            columns={tableColumns}
            data={distritos}
            emptyMessage="No hay distritos registrados"
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingDistrito ? 'Editar Distrito' : 'Nuevo Distrito'}
      >
        <form onSubmit={handleSubmit} className="distrito-form">
          <div className="form-row">
            <Input
              label="Nombre del Distrito"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Ej: Lima Centro"
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
              {loading ? 'Guardando...' : editingDistrito ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MisDistritos;