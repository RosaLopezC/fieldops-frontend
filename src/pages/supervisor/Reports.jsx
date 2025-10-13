import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';
import { FaEye, FaDownload, FaFilter, FaFileExcel, FaFileCsv } from 'react-icons/fa';
import './Reports.scss';

const SupervisorReports = () => {
  // Estados
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filtros
  const [filters, setFilters] = useState({
    distrito: '',
    zona: '',
    sector: '',
    tipo: '',
    estado: '',
    fecha_inicio: '',
    fecha_fin: '',
    search: ''
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      console.log('🔄 [Reports] Cargando reportes...');
      setLoading(true);
      const data = await reportService.getReports(filters);
      setReports(data);
      setCurrentPage(1); // Reset a primera página
    } catch (error) {
      console.error('❌ [Reports] Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (report) => {
    try {
      const detail = await reportService.getReportDetail(report.id);
      setSelectedReport(detail);
      setModalOpen(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDownloadReport = (report) => {
    console.log('📥 Descargando reporte:', report.id);
    alert(`Descargando reporte #${report.id} (Funcionalidad pendiente de backend)`);
  };

  // Funciones de exportación
  const handleExportExcel = () => {
    const dataToExport = getPaginatedReports();
    console.log('📊 Exportando a Excel:', dataToExport.length, 'reportes');
    alert(`Exportando ${dataToExport.length} reportes a Excel (Funcionalidad pendiente)`);
  };

  const handleExportCSV = () => {
    const postesOnly = getPaginatedReports().filter(r => r.tipo === 'electrico' || r.tipo === 'telematico');
    console.log('📄 Exportando postes a CSV:', postesOnly.length, 'reportes');
    alert(`Exportando ${postesOnly.length} postes a CSV (Funcionalidad pendiente)`);
  };

  // Paginación
  const getPaginatedReports = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return reports.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(reports.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset a primera página
  };

  // Configuración de columnas
  const tableColumns = [
    { header: 'ID', accessor: 'id', width: '80px' },
    { header: 'Tipo reporte', accessor: 'tipo' },
    { header: 'Código de Poste', accessor: 'codigo_poste' },
    { header: 'Distrito', accessor: 'distrito' },
    { header: 'Zona', accessor: 'zona' },
    { header: 'Sector', accessor: 'sector_nombre' },
    { header: 'Encargado', accessor: 'encargado_nombre' },
    { header: 'Fecha', accessor: 'fecha_reporte' },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value) => {
        const variants = {
          'completado': 'success',
          'pendiente': 'warning',
          'observado': 'danger',
          'registrado': 'info'
        };
        const labels = {
          'completado': 'Registrado',
          'pendiente': 'Pendiente',
          'observado': 'Observado',
          'registrado': 'Registrado'
        };
        return <Badge variant={variants[value]}>{labels[value]}</Badge>;
      }
    },
    {
      header: 'Acciones',
      accessor: 'acciones',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            size="small" 
            variant="outline" 
            icon={<FaEye />}
            onClick={() => handleViewDetail(row)}
          />
          <Button 
            size="small" 
            variant="secondary" 
            icon={<FaDownload />}
            onClick={() => handleDownloadReport(row)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="supervisor-reports">
      <div className="reports-header">
        <h1>Reporte</h1>
      </div>

      {/* Filtros */}
      <Card>
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-item">
              <label>Distrito</label>
              <select
                value={filters.distrito}
                onChange={(e) => setFilters({ ...filters, distrito: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="LOS OLIVOS">LOS OLIVOS</option>
                <option value="SAN JUAN">SAN JUAN</option>
                <option value="INDEPENDENCIA">INDEPENDENCIA</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Zona</label>
              <select
                value={filters.zona}
                onChange={(e) => setFilters({ ...filters, zona: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="Z10">Z10</option>
                <option value="Z20">Z20</option>
                <option value="Z30">Z30</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="Z10S11">Z10S11</option>
                <option value="Z20S11">Z20S11</option>
              </select>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-item">
              <label>Tipo de Estado</label>
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="observado">Observado</option>
                <option value="registrado">Registrado</option>
              </select>
            </div>

            <div className="filter-item">
              <Input
                type="date"
                label="Fecha inicio"
                value={filters.fecha_inicio}
                onChange={(e) => setFilters({ ...filters, fecha_inicio: e.target.value })}
                fullWidth
              />
            </div>

            <div className="filter-item">
              <Input
                type="date"
                label="Fecha fin"
                value={filters.fecha_fin}
                onChange={(e) => setFilters({ ...filters, fecha_fin: e.target.value })}
                fullWidth
              />
            </div>

            <div className="filter-item">
              <Input
                type="text"
                label="Buscador"
                placeholder="Buscar por ID"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                fullWidth
              />
            </div>

            <div className="filter-item filter-button">
              <Button 
                variant="primary" 
                icon={<FaFilter />} 
                onClick={loadReports}
                fullWidth
              >
                Filtrar
              </Button>
            </div>
          </div>

          {/* Botones de descarga */}
          <div className="download-buttons">
            <Button 
              variant="primary" 
              icon={<FaFileExcel />} 
              onClick={handleExportExcel}
              size="small"
            >
              Descargar xlsx
            </Button>
            <Button 
              variant="primary" 
              icon={<FaFileCsv />} 
              onClick={handleExportCSV}
              size="small"
            >
              Descargar CSV Postes
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando reportes...</p>
          </div>
        ) : (
          <>
            <Table
              columns={tableColumns}
              data={getPaginatedReports()}
              emptyMessage="No hay reportes disponibles"
            />
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              totalItems={reports.length}
            />
          </>
        )}
      </Card>

      {/* Modal de detalle */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Detalle del Reporte"
        size="large"
      >
        {selectedReport && (
          <div className="report-detail">
            <div className="detail-grid">
              <div className="detail-item">
                <strong>ID:</strong>
                <span>{selectedReport.id}</span>
              </div>
              <div className="detail-item">
                <strong>Tipo:</strong>
                <span>{selectedReport.tipo}</span>
              </div>
              <div className="detail-item">
                <strong>Estado:</strong>
                <Badge variant="info">{selectedReport.estado}</Badge>
              </div>
              <div className="detail-item">
                <strong>Encargado:</strong>
                <span>{selectedReport.encargado_nombre}</span>
              </div>
              <div className="detail-item">
                <strong>Distrito:</strong>
                <span>{selectedReport.distrito_nombre}</span>
              </div>
              <div className="detail-item">
                <strong>Zona:</strong>
                <span>{selectedReport.zona_nombre}</span>
              </div>
              <div className="detail-item">
                <strong>Sector:</strong>
                <span>{selectedReport.sector_nombre}</span>
              </div>
              <div className="detail-item">
                <strong>Fecha:</strong>
                <span>{selectedReport.fecha_reporte}</span>
              </div>
            </div>

            <div className="detail-section">
              <strong>Coordenadas:</strong>
              <p>{selectedReport.latitud}, {selectedReport.longitud}</p>
            </div>

            <div className="detail-section">
              <strong>Observaciones:</strong>
              <p>{selectedReport.observaciones || 'Sin observaciones'}</p>
            </div>

            {selectedReport.detalle_poste && (
              <div className="detail-section">
                <strong>Detalle del Poste:</strong>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Código:</strong>
                    <span>{selectedReport.detalle_poste.codigo}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Tensión:</strong>
                    <span>{selectedReport.detalle_poste.tension}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Altura:</strong>
                    <span>{selectedReport.detalle_poste.altura}m</span>
                  </div>
                  <div className="detail-item">
                    <strong>Propietario:</strong>
                    <span>{selectedReport.detalle_poste.propietario}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedReport.fotos && selectedReport.fotos.length > 0 && (
              <div className="detail-section">
                <strong>Fotos:</strong>
                <div className="photos-grid">
                  {selectedReport.fotos.map((foto) => (
                    <div key={foto.id} className="photo-item">
                      <img src={foto.url} alt={foto.tipo} />
                      <p>{foto.tipo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupervisorReports;