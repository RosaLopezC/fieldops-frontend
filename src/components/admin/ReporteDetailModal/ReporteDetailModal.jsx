import React, { useState } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import StatusBadge from '../../common/StatusBadge';
import ConfirmDialog from '../../common/ConfirmDialog';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaSearchPlus,
  FaDownload
} from 'react-icons/fa';
import './ReporteDetailModal.scss';

const ReporteDetailModal = ({ 
  isOpen, 
  onClose, 
  reporte,
  onAprobar,
  onRechazar,
  onObservar,
  userRole = 'admin' // 'admin' o 'supervisor'
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [loading, setLoading] = useState(false);

  if (!reporte) return null;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (actionType) {
        case 'aprobar':
          onAprobar && onAprobar(reporte.id);
          break;
        case 'rechazar':
          onRechazar && onRechazar(reporte.id);
          break;
        case 'observar':
          onObservar && onObservar(reporte.id, observacion);
          break;
        default:
          break;
      }

      setShowConfirmDialog(false);
      setObservacion('');
      onClose();
    } catch (error) {
      console.error('Error al procesar acción:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMapUrl = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  };

  const canTakeAction = reporte.estado === 'pendiente' && (userRole === 'admin' || userRole === 'supervisor');

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalle de Reporte"
        size="xlarge"
      >
        <div className="reporte-detail">
          {/* Header con estado */}
          <div className="reporte-header">
            <div className="reporte-header-left">
              <h3 className="reporte-id">Reporte #{reporte.id}</h3>
              <StatusBadge status={reporte.estado} size="large" />
            </div>
            <div className="reporte-header-right">
              <span className="reporte-tipo">{reporte.tipo}</span>
            </div>
          </div>

          <div className="reporte-content">
            {/* Columna Izquierda */}
            <div className="reporte-left">
              {/* Información General */}
              <div className="info-section">
                <h4 className="section-title">Información General</h4>
                
                <div className="info-grid">
                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Fecha de Registro</span>
                      <span className="info-value">{reporte.fecha}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaClock className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Hora</span>
                      <span className="info-value">{reporte.hora}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Encargado</span>
                      <span className="info-value">{reporte.encargado}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Ubicación</span>
                      <span className="info-value">
                        {reporte.zona} - {reporte.sector}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos Técnicos */}
              <div className="info-section">
                <h4 className="section-title">Datos Técnicos</h4>
                
                <div className="datos-tecnicos">
                  {reporte.datos && Object.entries(reporte.datos).map(([key, value]) => (
                    <div key={key} className="dato-item">
                      <span className="dato-label">{key}:</span>
                      <span className="dato-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones */}
              {reporte.observaciones && (
                <div className="info-section">
                  <h4 className="section-title">Observaciones</h4>
                  <p className="observaciones-text">{reporte.observaciones}</p>
                </div>
              )}

              {/* Historial */}
              {reporte.historial && reporte.historial.length > 0 && (
                <div className="info-section">
                  <h4 className="section-title">Historial de Cambios</h4>
                  <div className="historial-list">
                    {reporte.historial.map((item, index) => (
                      <div key={index} className="historial-item">
                        <div className="historial-icon">
                          {item.tipo === 'aprobado' && <FaCheckCircle style={{ color: '#28a745' }} />}
                          {item.tipo === 'rechazado' && <FaTimesCircle style={{ color: '#dc3545' }} />}
                          {item.tipo === 'observado' && <FaExclamationCircle style={{ color: '#ffc107' }} />}
                        </div>
                        <div className="historial-content">
                          <div className="historial-action">{item.accion}</div>
                          <div className="historial-user">{item.usuario}</div>
                          <div className="historial-date">{item.fecha}</div>
                          {item.comentario && (
                            <div className="historial-comment">{item.comentario}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Columna Derecha */}
            <div className="reporte-right">
              {/* Fotos */}
              <div className="info-section">
                <h4 className="section-title">
                  Evidencias Fotográficas ({reporte.fotos?.length || 0})
                </h4>
                
                {reporte.fotos && reporte.fotos.length > 0 ? (
                  <div className="fotos-grid">
                    {reporte.fotos.map((foto, index) => (
                      <div 
                        key={index} 
                        className="foto-item"
                        onClick={() => handleImageClick(foto)}
                      >
                        <img src={foto.url} alt={`Foto ${index + 1}`} />
                        <div className="foto-overlay">
                          <FaSearchPlus />
                          <span>Ver</span>
                        </div>
                        {foto.descripcion && (
                          <div className="foto-description">{foto.descripcion}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-fotos">
                    <p>No hay fotos disponibles</p>
                  </div>
                )}
              </div>

              {/* Mapa GPS */}
              <div className="info-section">
                <h4 className="section-title">Ubicación GPS</h4>
                
                {reporte.gps ? (
                  <div className="mapa-container">
                    <iframe
                      src={getMapUrl(reporte.gps.lat, reporte.gps.lng)}
                      width="100%"
                      height="300"
                      style={{ border: 0, borderRadius: '8px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mapa de ubicación"
                    ></iframe>
                    <div className="gps-coords">
                      <span>📍 Lat: {reporte.gps.lat}</span>
                      <span>Lng: {reporte.gps.lng}</span>
                      <span>Precisión: {reporte.gps.precision}m</span>
                    </div>
                  </div>
                ) : (
                  <div className="no-gps">
                    <p>No hay coordenadas GPS disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer con acciones */}
          {canTakeAction && (
            <div className="reporte-actions">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cerrar
              </Button>
              
              <div className="action-buttons">
                <Button
                  variant="success"
                  leftIcon={<FaCheckCircle />}
                  onClick={() => handleAction('aprobar')}
                >
                  Aprobar
                </Button>
                
                <Button
                  variant="warning"
                  leftIcon={<FaExclamationCircle />}
                  onClick={() => handleAction('observar')}
                >
                  Observar
                </Button>
                
                <Button
                  variant="danger"
                  leftIcon={<FaTimesCircle />}
                  onClick={() => handleAction('rechazar')}
                >
                  Rechazar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Imagen Ampliada */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Imagen Ampliada"
        size="large"
      >
        {selectedImage && (
          <div className="image-viewer">
            <img src={selectedImage.url} alt="Imagen ampliada" />
            {selectedImage.descripcion && (
              <p className="image-description">{selectedImage.descripcion}</p>
            )}
            <div className="image-actions">
              <Button
                variant="primary"
                leftIcon={<FaDownload />}
                onClick={() => window.open(selectedImage.url, '_blank')}
              >
                Descargar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setObservacion('');
        }}
        onConfirm={handleConfirmAction}
        title={
          actionType === 'aprobar' ? '¿Aprobar Reporte?' :
          actionType === 'rechazar' ? '¿Rechazar Reporte?' :
          '¿Observar Reporte?'
        }
        message={
          actionType === 'observar' ? (
            <div>
              <p>Escribe el motivo de la observación:</p>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Ej: Foto borrosa, falta información..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginTop: '12px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          ) : (
            `¿Estás seguro de ${actionType === 'aprobar' ? 'aprobar' : 'rechazar'} este reporte?`
          )
        }
        confirmText={
          actionType === 'aprobar' ? 'Aprobar' :
          actionType === 'rechazar' ? 'Rechazar' :
          'Observar'
        }
        variant={
          actionType === 'aprobar' ? 'success' :
          actionType === 'rechazar' ? 'danger' :
          'warning'
        }
        loading={loading}
      />
    </>
  );
};

export default ReporteDetailModal;