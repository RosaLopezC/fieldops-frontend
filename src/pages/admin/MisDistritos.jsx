import React, { useState, useCallback } from 'react';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import ExportButton from '../../components/common/ExportButton';
import { FaPlus, FaEdit, FaTrash, FaMapMarkedAlt } from 'react-icons/fa';
import { exportData } from '../../utils/exportUtils';
import './MisDistritos.scss';

const mockDistritos = [
  { id: 1, nombre: 'Lima Norte', zonas: 5, sectores: 12, estado: 'activo', fecha_creacion: '2024-01-15' },
  { id: 2, nombre: 'Lima Sur', zonas: 4, sectores: 10, estado: 'activo', fecha_creacion: '2024-01-20' },
  { id: 3, nombre: 'Lima Este', zonas: 3, sectores: 8, estado: 'activo', fecha_creacion: '2024-02-05' },
  { id: 4, nombre: 'Lima Centro', zonas: 6, sectores: 15, estado: 'activo', fecha_creacion: '2024-02-10' }
];

const MisDistritos = () => {
  const [distritos, setDistritos] = useState(mockDistritos);
  const [filteredData, setFilteredData] = useState(mockDistritos);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDistrito, setSelectedDistrito] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, distrito: null });

  const [formData, setFormData] = useState({ nombre: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Filtrar por búsqueda
  React.useEffect(() => {
    if (searchTerm) {
      setFilteredData(distritos.filter(d => 
        d.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredData(distritos);
    }
  }, [searchTerm, distritos]);

  const columns = [
    { key: 'id', label: 'ID', width: '80px', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { 
      key: 'zonas', 
      label: 'Zonas', 
      width: '100px',
      sortable: true,
      render: (value) => <span style={{ fontWeight: 600, color: '#0066cc' }}>{value}</span>
    },
    { 
      key: 'sectores', 
      label: 'Sectores', 
      width: '100px',
      sortable: true,
      render: (value) => <span style={{ fontWeight: 600, color: '#FF6B35' }}>{value}</span>
    },
    { 
      key: 'estado', 
      label: 'Estado', 
      width: '120px',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'fecha_creacion', label: 'Fecha Creación', width: '130px', sortable: true }
  ];

  const renderActions = (distrito) => (
    <div className="table-actions">
      <button className="action-btn action-btn--edit" onClick={() => handleEdit(distrito)} title="Editar">
        <FaEdit />
      </button>
      <button className="action-btn action-btn--danger" onClick={() => handleDelete(distrito)} title="Eliminar">
        <FaTrash />
      </button>
    </div>
  );

  const handleCreate = () => {
    setFormData({ nombre: '' });
    setFormErrors({});
    setSelectedDistrito(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async () => {
    if (!formData.nombre.trim()) {
      setFormErrors({ nombre: 'El nombre es requerido' });
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newDistrito = {
      id: distritos.length + 1,
      nombre: formData.nombre,
      zonas: 0,
      sectores: 0,
      estado: 'activo',
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    setDistritos(prev => [...prev, newDistrito]);
    setIsCreateModalOpen(false);
    setSaving(false);
    alert('✅ Distrito creado exitosamente');
  };

  const handleEdit = (distrito) => {
    setSelectedDistrito(distrito);
    setFormData({ nombre: distrito.nombre });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!formData.nombre.trim()) {
      setFormErrors({ nombre: 'El nombre es requerido' });
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setDistritos(prev => prev.map(d => 
      d.id === selectedDistrito.id ? { ...d, nombre: formData.nombre } : d
    ));

    setIsEditModalOpen(false);
    setSaving(false);
    alert('✅ Distrito actualizado exitosamente');
  };

  const handleDelete = (distrito) => {
    setConfirmDialog({ isOpen: true, distrito });
  };

  const handleConfirmDelete = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setDistritos(prev => prev.filter(d => d.id !== confirmDialog.distrito.id));
    setConfirmDialog({ isOpen: false, distrito: null });
    setSaving(false);
    alert('✅ Distrito eliminado exitosamente');
  };

  const handleExport = useCallback(async (format, filename) => {
    const dataToExport = filteredData.map(d => ({
      'ID': d.id,
      'Nombre': d.nombre,
      'Zonas': d.zonas,
      'Sectores': d.sectores,
      'Estado': d.estado,
      'Fecha Creación': d.fecha_creacion
    }));

    const result = await exportData(format, dataToExport, filename, 'Listado de Distritos');
    if (result.success) return true;
    throw new Error('Error al exportar');
  }, [filteredData]);

  return (
    <div className="distritos-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Mis Distritos</h1>
          <p className="page-subtitle">Gestiona las divisiones territoriales de tu empresa</p>
        </div>
        <div className="page-header-actions">
          <Button variant="primary" leftIcon={<FaPlus />} onClick={handleCreate}>
            Nuevo Distrito
          </Button>
        </div>
      </div>

      <Card className="filters-card">
        <div className="filters-header">
          <SearchBar
            placeholder="Buscar distrito..."
            onSearch={setSearchTerm}
            initialValue={searchTerm}
          />
          <ExportButton
            data={filteredData}
            onExport={handleExport}
            filename={`distritos-${new Date().toISOString().split('T')[0]}`}
          />
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredData}
          actions={renderActions}
          emptyMessage="No se encontraron distritos"
          pagination={true}
          itemsPerPage={10}
          sortable={true}
        />
      </Card>

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !saving && setIsCreateModalOpen(false)}
        title="Crear Nuevo Distrito"
        size="small"
      >
        <Input
          label="Nombre del Distrito"
          name="nombre"
          value={formData.nombre}
          onChange={(e) => {
            setFormData({ nombre: e.target.value });
            setFormErrors({});
          }}
          error={formErrors.nombre}
          placeholder="Ej: Lima Norte"
          required
        />
        <Modal.Footer
          onCancel={() => setIsCreateModalOpen(false)}
          onConfirm={handleSaveCreate}
          confirmText="Crear"
          confirmLoading={saving}
        />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !saving && setIsEditModalOpen(false)}
        title="Editar Distrito"
        size="small"
      >
        <Input
          label="Nombre del Distrito"
          name="nombre"
          value={formData.nombre}
          onChange={(e) => {
            setFormData({ nombre: e.target.value });
            setFormErrors({});
          }}
          error={formErrors.nombre}
          required
        />
        <Modal.Footer
          onCancel={() => setIsEditModalOpen(false)}
          onConfirm={handleSaveEdit}
          confirmText="Guardar"
          confirmLoading={saving}
        />
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, distrito: null })}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Distrito?"
        message={`¿Estás seguro de eliminar "${confirmDialog.distrito?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        loading={saving}
      />
    </div>
  );
};

export default MisDistritos;