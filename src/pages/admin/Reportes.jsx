import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { FaFilter, FaDownload } from 'react-icons/fa';
import './Reportes.scss';

const AdminReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    estado: 'todos',
    distrito: '',
    zona: ''
  });

  useEffect(() => {
    loadReportes();
  }, []);

  const loadReportes = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReportes(filters);
      setReportes(response.data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      alert('Error al cargar reportes: ' + error.message);
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
    loadReportes();
  };

  const handleExport = () => {
    alert('Funcionalidad de exportación en desarrollo');
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Registrado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Observado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const tableColumns = [
    {
      accessor: 'id',
      header: 'ID',
      width: '80px'
    },
    {
      accessor: 'tipo',
      header: 'Tipo',
      width: '100px'
    },
    {
      accessor: 'codigo',
      header: 'Código',
      width: '120px'
    },
    {
      accessor: 'distrito',
      header: 'Distrito',
      width: '130px'
    },
    {
      accessor: 'zona',
      header: 'Zona',
      width: '80px'
    },
    {
      accessor: 'sector',
      header: 'Sector',
      width: '100px'
    },
    {
      accessor: 'encargado',
      header: 'Encargado',
      width: '150px'
    },
    {
      accessor: 'supervisor',
      header: 'Supervisor',
      width: '150px'
    },
    {
      accessor: 'fecha',
      header: 'Fecha',
      width: '150px'
    },
    {
      accessor: 'estado',
      header: 'Estado',
      width: '120px',
      render: (value) => (
        <Badge variant={getEstadoBadge(value)}>
          {value}
        </Badge>
      )
    }
  ];

  return (
    <div className="admin-reportes-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Visualiza todos los reportes de tu empresa</p>
        </div>
        <Button
          variant="primary"
          icon={<FaDownload />}
          onClick={handleExport}
        >
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">Estado</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="select-input"
            >
              <option value="todos">Todos</option>
              <option value="Registrado">Registrado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Observado">Observado</option>
            </select>
          </div>

          <div className="filter-group">
            <Input
              label="Distrito"
              name="distrito"
              value={filters.distrito}
              onChange={handleFilterChange}
              placeholder="Buscar distrito..."
            />
          </div>

          <div className="filter-group">
            <Input
              label="Zona"
              name="zona"
              value={filters.zona}
              onChange={handleFilterChange}
              placeholder="Ej: Z10"
            />
          </div>

          <div className="filter-group filter-button">
            <Button
              variant="primary"
              icon={<FaFilter />}
              onClick={handleFilter}
              disabled={loading}
            >
              Filtrar
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de reportes */}
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando reportes...</p>
          </div>
        ) : (
          <>
            <div className="reportes-count">
              <p>Total de reportes: <strong>{reportes.length}</strong></p>
            </div>
            <Table
              columns={tableColumns}
              data={reportes}
              emptyMessage="No hay reportes registrados"
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminReportes;