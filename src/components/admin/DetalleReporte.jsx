import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import adminService from '../../services/adminService';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { 
  FaTimes, 
  FaMapMarkerAlt, 
  FaUser, 
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './DetalleReporte.scss';

const DetalleReporte = ({ reporteId, isOpen, onClose }) => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    if (isOpen && reporteId) {
      loadReporteDetalle();
    }
  }, [isOpen, reporteId]);

  const loadReporteDetalle = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReporteDetalle(reporteId);
      setReporte(response.data);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
      alert('Error al cargar detalle del reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = () => {
    if (window.confirm('¿Estás seguro de aprobar este reporte?')) {
      alert('Reporte aprobado (funcionalidad de backend pendiente)');
      onClose();
    }
  };

  const handleObservar = () => {
    const comentario = prompt('Ingresa el motivo de la observación:');
    if (comentario) {
      alert(`Reporte observado con comentario: "${comentario}"\n(funcionalidad de backend pendiente)`);
      onClose();
    }
  };

  const handleRechazar = () => {
    const motivo = prompt('Ingresa el motivo del rechazo:');
    if (motivo) {
      if (window.confirm('¿Estás seguro de rechazar este reporte? Esta acción no se puede deshacer.')) {
        alert(`Reporte rechazado: "${motivo}"\n(funcionalidad de backend pendiente)`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Reporte"
      size="large"
    >
      {loading ? (
        <div className="loading-container">
          <p>Cargando detalle del reporte...</p>
        </div>
      ) : reporte ? (
        <div className="detalle-reporte">
          {/* Header con info básica */}
          <div className="reporte-header">
            <div className="header-info">
              <h2>Reporte #{reporte.id}</h2>
              <p className="reporte-codigo">{reporte.codigo}</p>
              <Badge variant={
                reporte.estado === 'Registrado' ? 'success' :
                reporte.estado === 'Pendiente' ? 'warning' :
                reporte.estado === 'Observado' ? 'danger' : 'secondary'
              }>
                {reporte.estado}
              </Badge>
            </div>
            <div className="header-meta">
              <div className="meta-item">
                <FaCalendar />
                <span>{reporte.fecha_registro}</span>
              </div>
              <div className="meta-item">
                <FaUser />
                <span>{reporte.encargado.nombre}</span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="reporte-content">
            {/* Galería de fotos */}
            <div className="fotos-section">
              <h3>Fotografías ({reporte.fotos.length})</h3>
              <div className="foto-principal">
                <img 
                  src={reporte.fotos[selectedPhoto].url} 
                  alt={reporte.fotos[selectedPhoto].descripcion}
                />
                <p className="foto-descripcion">
                  {reporte.fotos[selectedPhoto].descripcion}
                  {reporte.fotos[selectedPhoto].obligatoria && 
                    <Badge variant="primary" style={{ marginLeft: '8px' }}>Obligatoria</Badge>
                  }
                </p>
              </div>
              <div className="fotos-thumbnails">
                {reporte.fotos.map((foto, index) => (
                  <div 
                    key={foto.id}
                    className={`thumbnail ${index === selectedPhoto ? 'active' : ''}`}
                    onClick={() => setSelectedPhoto(index)}
                  >
                    <img src={foto.url} alt={`Foto ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa de ubicación */}
            <div className="mapa-section">
              <h3>Ubicación GPS</h3>
              <div className="mapa-info">
                <p><FaMapMarkerAlt /> Lat: {reporte.gps.latitud}, Lng: {reporte.gps.longitud}</p>
                <p>Precisión: {reporte.gps.precision}</p>
              </div>
              <div className="mapa-container">
                <MapContainer
                  center={[reporte.gps.latitud, reporte.gps.longitud]}
                  zoom={16}
                  style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[reporte.gps.latitud, reporte.gps.longitud]}>
                    <Popup>
                      {reporte.codigo}<br />
                      {reporte.distrito}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Datos del poste */}
            <div className="datos-section">
              <h3>Datos del Poste</h3>
              <div className="datos-grid">
                <div className="dato-item">
                  <span className="dato-label">Material:</span>
                  <span className="dato-value">{reporte.poste.material}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Tipo:</span>
                  <span className="dato-value">{reporte.poste.tipo_estructura}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Altura:</span>
                  <span className="dato-value">{reporte.poste.altura}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Resistencia:</span>
                  <span className="dato-value">{reporte.poste.resistencia}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Estado físico:</span>
                  <span className="dato-value">{reporte.poste.estado_fisico}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Inclinación:</span>
                  <span className="dato-value">{reporte.poste.inclinacion}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Propietario:</span>
                  <span className="dato-value">{reporte.poste.propietario}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Zona instalación:</span>
                  <span className="dato-value">{reporte.poste.zona_instalacion}</span>
                </div>
              </div>
            </div>

            {/* Cables y elementos */}
            <div className="datos-section">
              <h3>Cables y Elementos</h3>
              <div className="datos-grid">
                <div className="dato-item">
                  <span className="dato-label">Cable de cobre:</span>
                  <span className="dato-value">{reporte.cables.cable_cobre}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Fibra óptica:</span>
                  <span className="dato-value">{reporte.cables.fibra_optica}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Cable TV:</span>
                  <span className="dato-value">{reporte.cables.cable_television}</span>
                </div>
                <div className="dato-item">
                  <span className="dato-label">Número de cables:</span>
                  <span className="dato-value">{reporte.cables.numero_cables}</span>
                </div>
              </div>
            </div>

            {/* Observaciones */}
            {reporte.observaciones && (
              <div className="observaciones-section">
                <h3>Observaciones del Encargado</h3>
                <p>{reporte.observaciones}</p>
              </div>
            )}

            {/* Comentarios del supervisor */}
            {reporte.comentarios_supervisor && (
              <div className="comentarios-section alert-warning">
                <h3>⚠️ Observaciones del Supervisor</h3>
                <p>{reporte.comentarios_supervisor}</p>
              </div>
            )}
          </div>

          {/* Acciones */}
          {reporte.estado === 'Registrado' && (
            <div className="reporte-actions">
              <Button
                variant="success"
                icon={<FaCheckCircle />}
                onClick={handleAprobar}
              >
                Aprobar
              </Button>
              <Button
                variant="warning"
                icon={<FaExclamationCircle />}
                onClick={handleObservar}
              >
                Observar
              </Button>
              <Button
                variant="danger"
                icon={<FaTimesCircle />}
                onClick={handleRechazar}
              >
                Rechazar
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p>No se pudo cargar el reporte</p>
      )}
    </Modal>
  );
};

export default DetalleReporte;