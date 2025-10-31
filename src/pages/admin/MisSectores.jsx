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
import './MisSectores.scss';

const mockZonas = [
  { id: 1, nombre: 'Zona A', distrito_nombre: 'Lima Norte' },
  { id: 2, nombre: 'Zona B', distrito_nombre: 'Lima Norte' },
  { id: 3, nombre: 'Zona C', distrito_nombre: 'Lima Sur' },
  { id: 4, nombre: 'Zona D', distrito_nombre: 'Lima Sur' },
  { id: 5, nombre: 'Zona E', distrito_nombre: 'Lima Este' }
];

const mockSectores = [
  { id: 1, nombre: 'Sector A1', zona_id: 1, zona_nombre: 'Zona A', distrito_nombre: 'Lima Norte', encargados: 2, estado: 'activo', fecha_creacion: '2024-01-25' },
  { id: 2, nombre: 'Sector A2', zona_id: 1, zona_nombre: 'Zona A', distrito_nombre: 'Lima Norte', encargados: 1, estado: 'activo', fecha_creacion: '2024-01-26' },
  { id: 3, nombre: 'Sector B1', zona_id: 2, zona_nombre: 'Zona B', distrito_nombre: 'Lima Norte', encargados: 3, estado: 'activo', fecha_creacion: '2024-02-01' },
  { id: 4, nombre: 'Sector C1', zona_id: 3, zona_nombre: 'Zona C', distrito_nombre: 'Lima Sur', encargados: 2, estado: 'activo', fecha_creacion: '2024-02-05' },
  { id: 5, nombre: 'Sector D1', zona_id: 4, zona_nombre: 'Zona D', distrito_nombre: 'Lima Sur', encargados: 1, estado: 'activo', fecha_creacion: '2024-02-10' }
];

const MisSectores = () => {
  const [sectores, setSectores] = useState(mockSectores);
  const [filteredData, setFilteredData] = useState(mockSectores);
  const [searchTerm, setSearchTerm] = useState('');
  const [zonaFilter, setZonaFilter] = useState('todos');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, sector: null });

  const [formData, setFormData] = useState({ nombre: '', zona_id: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Filtrar
  React.useEffect(() => {
    let filtered = sectores;

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.zona_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.distrito_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (zonaFilter !== 'todos') {
      filtered = filtered.filter(s => s.zona_id === parseInt(zonaFilter));
    }

    setFilteredData(filtered);
  }, [searchTerm, zonaFilter, sectores]);

  const columns = [
    { key: 'id', label: 'ID', width: '80px', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { 
      key: 'zona_nombre', 
      label: 'Zona', 
      sortable: true,
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>{row.distrito_nombre}</div>
        </div>
      )
    },
    { 
      key: 'encargados', 
      label: 'Encargados', 
      width: '120px',
      sortable: true,
      render: (value) => <span style={{ fontWeight: 600, color: value > 0 ? '#0066cc' : '#6c757d' }}>{value}</span>
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

  const renderActions = (sector) => (
    <div className="table-actions">
      <button className="action-btn action-btn--edit" onClick={() => handleEdit(sector)} title="Editar">
        <FaEdit />
      </button>
      <button className="action-btn action-btn--danger" onClick={() => handleDelete(sector)} title="Eliminar">
        <FaTrash />
      </button>
    </div>
  );

  const handleCreate = () => {
    setFormData({ nombre: '', zona_id: '' });
    setFormErrors({});
    setSelectedSector(null);
    setIsCreateModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.zona_id) errors.zona_id = 'La zona es requerida';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCreate = async () => {
    if (!validateForm()) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const zona = mockZonas.find(z => z.id === parseInt(formData.zona_id));

    const newSector = {
      id: sectores.length + 1,
      nombre: formData.nombre,
      zona_id: parseInt(formData.zona_id),
      zona_nombre: zona.nombre,
      distrito_nombre: zona.distrito_nombre,
      encargados: 0,
      estado: 'activo',
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    setSectores(prev => [...prev, newSector]);
    setIsCreateModalOpen(false);
    setSaving(false);
    alert('✅ Sector creado exitosamente');
  };

  const handleEdit = (sector) => {
    setSelectedSector(sector);
    setFormData({ nombre: sector.nombre, zona_id: sector.zona_id.toString() });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const zona = mockZonas.find(z => z.id === parseInt(formData.zona_id));

    setSectores(prev => prev.map(s => 
      s.id === selectedSector.id 
        ? { 
            ...s, 
            nombre: formData.nombre, 
            zona_id: parseInt(formData.zona_id),
            zona_nombre: zona.nombre,
            distrito_nombre: zona.distrito_nombre
          } 
        : s
    ));

    setIsEditModalOpen(false);
    setSaving(false);
    alert('✅ Sector actualizado exitosamente');
  };

  const handleDelete = (sector) => {
    setConfirmDialog({ isOpen: true, sector });
  };

  const handleConfirmDelete = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    setSectores(prev => prev.filter(s => s.id !== confirmDialog.sector.id));
    setConfirmDialog({ isOpen: false, sector: null });
    setSaving(false);
    alert('✅ Sector eliminado exitosamente');
  };

  const handleExport = useCallback(async (format, filename) => {
    const dataToExport = filteredData.map(s => ({
      'ID': s.id,
      'Nombre': s.nombre,
      'Zona': s.zona_nombre,
      'Distrito': s.distrito_nombre,
      'Encargados': s.encargados,
      'Estado': s.estado,
      'Fecha Creación': s.fecha_creacion
    }));

    const result = await exportData(format, dataToExport, filename, 'Listado de Sectores');
    if (result.success) return true;
    throw new Error('Error al exportar');
  }, [filteredData]);

  return (
    <div className="sectores-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Mis Sectores</h1>
          <p className="page-subtitle">Gestiona los sectores dentro de cada zona</p>
        </div>
        <div className="page-header-actions">
          <Button variant="primary" leftIcon={<FaPlus />} onClick={handleCreate}>
            Nuevo Sector
          </Button>
        </div>
      </div>

      <Card className="filters-card">
        <div className="filters-header">
          <div className="filters-left">
            <SearchBar
              placeholder="Buscar sector, zona o distrito..."
              onSearch={setSearchTerm}
              initialValue={searchTerm}
            />
            <select
              value={zonaFilter}
              onChange={(e) => setZonaFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todas las Zonas</option>
              {mockZonas.map(z => (
                <option key={z.id} value={z.id}>{z.nombre} ({z.distrito_nombre})</option>
              ))}
            </select>
          </div>
          <ExportButton
            data={filteredData}
            onExport={handleExport}
            filename={`sectores-${new Date().toISOString().split('T')[0]}`}
          />
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          data={filteredData}
          actions={renderActions}
          emptyMessage="No se encontraron sectores"
          pagination={true}
          itemsPerPage={10}
          sortable={true}
        />
      </Card>

      {/* Modal Crear */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !saving && setIsCreateModalOpen(false)}
        title="Crear Nuevo Sector"
        size="small"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nombre del Sector"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, nombre: e.target.value }));
              setFormErrors(prev => ({ ...prev, nombre: '' }));
            }}
            error={formErrors.nombre}
            placeholder="Ej: Sector A1"
            required
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Zona *</label>
            <select
              value={formData.zona_id}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, zona_id: e.target.value }));
                setFormErrors(prev => ({ ...prev, zona_id: '' }));
              }}
              style={{
                padding: '12px',
                border: formErrors.zona_id ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Seleccionar zona...</option>
              {mockZonas.map(z => (
                <option key={z.id} value={z.id}>
                  {z.nombre} - {z.distrito_nombre}
                </option>
              ))}
            </select>
            {formErrors.zona_id && (
              <span style={{ fontSize: '12px', color: '#dc3545' }}>{formErrors.zona_id}</span>
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
        title="Editar Sector"
        size="small"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Nombre del Sector"
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
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Zona *</label>
            <select
              value={formData.zona_id}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, zona_id: e.target.value }));
                setFormErrors(prev => ({ ...prev, zona_id: '' }));
              }}
              style={{
                padding: '12px',
                border: formErrors.zona_id ? '1px solid #dc3545' : '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Seleccionar zona...</option>
              {mockZonas.map(z => (
                <option key={z.id} value={z.id}>
                  {z.nombre} - {z.distrito_nombre}
                </option>
              ))}
            </select>
            {formErrors.zona_id && (
              <span style={{ fontSize: '12px', color: '#dc3545' }}>{formErrors.zona_id}</span>
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
        onClose={() => setConfirmDialog({ isOpen: false, sector: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Sector"
        message={`¿Estás seguro de eliminar el sector "${confirmDialog.sector?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        confirmLoading={saving}
      />
    </div>
  );
};

export default MisSectores;