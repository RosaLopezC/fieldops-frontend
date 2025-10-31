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
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { exportData } from '../../utils/exportUtils';
import './MisZonas.scss';

const mockDistritos = [
  { id: 1, nombre: 'Lima Norte' },
  { id: 2, nombre: 'Lima Sur' },
  { id: 3, nombre: 'Lima Este' },
  { id: 4, nombre: 'Lima Centro' }
];

const mockZonas = [
  { id: 1, nombre: 'Zona A', distrito_id: 1, distrito_nombre: 'Lima Norte', sectores: 3, estado: 'activo', fecha_creacion: '2024-01-20' },
  { id: 2, nombre: 'Zona B', distrito_id: 1, distrito_nombre: 'Lima Norte', sectores: 4, estado: 'activo', fecha_creacion: '2024-01-25' },
  { id: 3, nombre: 'Zona C', distrito_id: 2, distrito_nombre: 'Lima Sur', sectores: 2, estado: 'activo', fecha_creacion: '2024-02-01' },
  { id: 4, nombre: 'Zona D', distrito_id: 2, distrito_nombre: 'Lima Sur', sectores: 3, estado: 'activo', fecha_creacion: '2024-02-05' },
  { id: 5, nombre: 'Zona E', distrito_id: 3, distrito_nombre: 'Lima Este', sectores: 2, estado: 'activo', fecha_creacion: '2024-02-10' }
];

const MisZonas = () => {
  const [zonas, setZonas] = useState(mockZonas);
  const [filteredData, setFilteredData] = useState(mockZonas);
  const [searchTerm, setSearchTerm] = useState('');
  const [distritoFilter, setDistritoFilter] = useState('todos');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedZona, setSelectedZona] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, zona: null });

  const [formData, setFormData] = useState({ nombre: '', distrito_id: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Filtrar
  React.useEffect(() => {
    let filtered = zonas;

    if (searchTerm) {
      filtered = filtered.filter(z => 
        z.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.distrito_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (distritoFilter !== 'todos') {
      filtered = filtered.filter(z => z.distrito_id === parseInt(distritoFilter));
    }

    setFilteredData(filtered);
  }, [searchTerm, distritoFilter, zonas]);

  const columns = [
    { key: 'id', label: 'ID', width: '80px', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { 
      key: 'distrito_nombre', 
      label: 'Distrito', 
      sortable: true,
      render: (value) => (
        <span style={{ 
          padding: '4px 12px',
          background: 'rgba(0, 102, 204, 0.1)',
          color: '#0066cc',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          {value}
        </span>
      )
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

  const renderActions = (zona) => (
    <div className="table-actions">
      <button className="action-btn action-btn--edit" onClick={() => handleEdit(zona)} title="Editar">
        <FaEdit />
      </button>
      <button className="action-btn action-btn--danger" onClick={() => handleDelete(zona)} title="Eliminar">
        <FaTrash />
      </button>
    </div>
  );

  const handleCreate = () => {
    setFormData({ nombre: '', distrito_id: '' });
    setFormErrors({});
    setSelectedZona(null);
    setIsCreateModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.distrito_id) errors.distrito_id = 'El distrito es requerido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCreate = async () => {
    if (!validateForm()) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const distrito = mockDistritos.find(d => d.id === parseInt(formData.distrito_id));

    const newZona = {
      id: zonas.length + 1,
      nombre: formData.nombre,
      distrito_id: parseInt(formData.distrito_id),
      distrito_nombre: distrito.nombre,
      sectores: 0,
      estado: 'activo',
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    setZonas(prev => [...prev, newZona]);
    setIsCreateModalOpen(false);
    setSaving(false);
    alert('✅ Zona creada exitosamente');
  };

  const handleEdit = (zona) => {
    setSelectedZona(zona);
    setFormData({ nombre: zona.nombre, distrito_id: zona.distrito_id.toString() });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const distrito = mockDistritos.find(d => d.id === parseInt(formData.distrito_id));

    setZonas(prev => prev.map(z => 
      z.id === selectedZona.id 
        ? { 
            ...z, 
            nombre: formData.nombre, 
            distrito_id: parseInt(formData.distrito_id),
            distrito_nombre: distrito.nombre
          } 
        : z
    ));

    setIsEditModalOpen(false);
    setSaving(false);
    alert('✅ Zona actualizada exitosamente');
  };

  const handleDelete = (zona) => {
    setConfirmDialog({ isOpen: true, zona });
  };

  const handleConfirmDelete = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setZonas(prev => prev.filter(z => z.id !== confirmDialog.zona.id));
    setConfirmDialog({ isOpen: false, zona: null });
    setSaving(false);
    alert('✅ Zona eliminada exitosamente');
  };

  const handleExport = useCallback(async (format, filename) => {
    const dataToExport = filteredData.map(z => ({
      'ID': z.id,
      'Nombre': z.nombre,
      'Distrito': z.distrito_nombre,
      'Sectores': z.sectores,
      'Estado': z.estado,
      'Fecha Creación': z.fecha_creacion
    }));

    const result = await exportData(format, dataToExport, filename, 'Listado de Zonas');
    if (result.success) return true;
    throw new Error('Error al exportar');
  }, [filteredData]);

  return (
    <div className="zonas-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Mis Zonas</h1>
          <p className="page-subtitle">Gestiona las zonas dentro de cada distrito</p>
        </div>
        <div className="page-header-actions">
          <Button variant="primary" leftIcon={<FaPlus />} onClick={handleCreate}>
            Nueva Zona
          </Button>
        </div>
      </div>

      <Card className="filters-card">
        <div className="filters-header">
          <div className="filters-left">
            <SearchBar
              placeholder="Buscar zona o distrito..."
              onSearch={setSearchTerm}
              initialValue={searchTerm}
            />
            <select
              value={distritoFilter}
              onChange={(e) => setDistritoFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos los Distritos</option>
              {mockDistritos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
          <ExportButton
            data={filteredData}
            onExport={handleExport}
            filename={`zonas-${new Date().toISOString().split('T')[0]}`}
          />
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredData}
          actions={renderActions}
          emptyMessage="No se encontraron zonas"
          pagination={true}
          itemsPerPage={10}
          sortable={true}
        />
      </Card>

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !saving && setIsCreateModalOpen(false)}
        title="Crear Nueva Zona"
        size="small"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nombre de la Zona"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, nombre: e.target.value }));
              setFormErrors(prev => ({ ...prev, nombre: '' }));
            }}
            error={formErrors.nombre}
            placeholder="Ej: Zona A"
            required
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Distrito *</label>
            <select
              value={formData.distrito_id}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, distrito_id: e.target.value }));
                setFormErrors(prev => ({ ...prev, distrito_id: '' }));
              }}
              style={{
                padding: '12px',
                border: formErrors.distrito_id ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Seleccionar distrito...</option>
              {mockDistritos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
            {formErrors.distrito_id && (
              <span style={{ fontSize: '12px', color: '#dc3545' }}>{formErrors.distrito_id}</span>
            )}
          </div>
        </div>
        
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
        title="Editar Zona"
        size="small"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nombre de la Zona"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, nombre: e.target.value }));
              setFormErrors(prev => ({ ...prev, nombre: '' }));
            }}
            error={formErrors.nombre}
            required
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Distrito *</label>
            <select
              value={formData.distrito_id}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, distrito_id: e.target.value }));
                setFormErrors(prev => ({ ...prev, distrito_id: '' }));
              }}
              style={{
                padding: '12px',
                border: formErrors.distrito_id ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Seleccionar distrito...</option>
              {mockDistritos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
            {formErrors.distrito_id && (
              <span style={{ fontSize: '12px', color: '#dc3545' }}>{formErrors.distrito_id}</span>
            )}
          </div>
        </div>
        
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
        onClose={() => setConfirmDialog({ isOpen: false, zona: null })}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Zona?"
        message={`¿Estás seguro de eliminar "${confirmDialog.zona?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
        loading={saving}
      />
    </div>
  );
};

export default MisZonas;