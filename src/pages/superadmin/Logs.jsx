import React, { useState, useEffect } from 'react';
import superadminService from '../../services/superadminService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { FaFilter } from 'react-icons/fa';
import './Logs.scss';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    tipo: 'todos'
  });

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getLogs(filters);
      setLogs(response.data);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogVariant = (tipo) => {
    switch (tipo) {
      case 'creacion':
        return 'success';
      case 'modificacion':
        return 'info';
      case 'seguridad':
        return 'warning';
      case 'eliminacion':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="logs-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Logs de Auditoría</h1>
          <p>Registro de todas las acciones del sistema</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div className="filters-section">
          <div className="filter-item">
            <label>Tipo de Acción</label>
            <select
              value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
              className="select-input"
            >
              <option value="todos">Todas</option>
              <option value="creacion">Creación</option>
              <option value="modificacion">Modificación</option>
              <option value="seguridad">Seguridad</option>
              <option value="eliminacion">Eliminación</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabla de logs */}
      <Card title="Historial de Actividad">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando logs...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="log-fecha">{log.fecha}</td>
                    <td className="log-usuario">{log.usuario}</td>
                    <td className="log-accion">{log.accion}</td>
                    <td className="log-detalle">{log.detalle}</td>
                    <td>
                      <Badge variant={getLogVariant(log.tipo)}>
                        {log.tipo}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Logs;