import React, { useState, useEffect } from 'react';
import authService from '../../../services/authService';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { FaDatabase, FaExclamationTriangle, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import './StorageWidget.scss';

const StorageWidget = () => {
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccountStatus();
  }, []);

  const loadAccountStatus = async () => {
    try {
      const verificacion = await authService.verificarEstadoCuentaAdmin();
      setAccountStatus(verificacion);
    } catch (error) {
      console.error('Error al cargar estado de cuenta:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="storage-widget">
          <p style={{ textAlign: 'center', color: '#666' }}>Cargando información...</p>
        </div>
      </Card>
    );
  }

  if (!accountStatus || !accountStatus.datos) {
    return null;
  }

  const { datos, alertas } = accountStatus;
  const porcentajeUsado = (datos.storage_usado / datos.storage_plan) * 100;
  const storageExtra = datos.storage_extra || 0;

  const getStorageColor = () => {
    if (porcentajeUsado >= 100) return '#dc3545';
    if (porcentajeUsado >= 80) return '#ffc107';
    return '#28a745';
  };

  const getStatusIcon = () => {
    if (porcentajeUsado >= 100) return <FaExclamationTriangle />;
    if (porcentajeUsado >= 80) return <FaExclamationTriangle />;
    return <FaCheckCircle />;
  };

  return (
    <Card className="storage-widget-card">
      <div className="storage-widget">
        <div className="storage-widget__header">
          <h3>
            <FaDatabase /> Almacenamiento
          </h3>
          {porcentajeUsado >= 80 && (
            <Badge variant={porcentajeUsado >= 100 ? 'danger' : 'warning'}>
              {porcentajeUsado >= 100 ? 'Excedido' : 'Casi lleno'}
            </Badge>
          )}
        </div>

        <div className="storage-widget__progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min(porcentajeUsado, 100)}%`,
                backgroundColor: getStorageColor()
              }}
            >
              <span className="progress-text">
                {porcentajeUsado.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="progress-info">
            <span className="storage-used">
              {datos.storage_usado.toFixed(1)} GB
            </span>
            <span className="storage-divider">/</span>
            <span className="storage-total">
              {datos.storage_plan} GB
            </span>
          </div>
        </div>

        {storageExtra > 0 && (
          <div className="storage-widget__alert">
            <div className="alert alert-warning">
              <FaExclamationTriangle />
              <div>
                <strong>Almacenamiento Extra:</strong>
                <p>Has usado {storageExtra.toFixed(1)} GB adicionales</p>
              </div>
            </div>
          </div>
        )}

        <div className="storage-widget__expiry">
          <FaCalendarAlt />
          <div>
            <span className="label">Tu plan vence en:</span>
            <strong className={datos.dias_restantes <= 7 ? 'text-danger' : 'text-success'}>
              {datos.dias_restantes} días
            </strong>
          </div>
        </div>

        {alertas && alertas.length > 0 && (
          <div className="storage-widget__alerts">
            {alertas.map((alerta, index) => (
              <div 
                key={index} 
                className={`alert alert-${alerta.nivel}`}
              >
                {getStatusIcon()}
                <span>{alerta.mensaje}</span>
              </div>
            ))}
          </div>
        )}

        <div className="storage-widget__actions">
          <Button
            variant="outline"
            size="small"
            onClick={() => window.location.href = 'mailto:soporte@fieldops.com?subject=Actualizar Plan'}
          >
            Actualizar Plan
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => window.location.href = 'mailto:soporte@fieldops.com?subject=Renovar Plan'}
          >
            Renovar Ahora
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StorageWidget;