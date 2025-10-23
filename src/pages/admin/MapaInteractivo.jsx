import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import { exportToExcel, exportToPDF, showExportModal } from '../../utils/exportUtils';
import mapService from '../../services/mapService';
import Button from '../../components/common/Button';
import { 
  FaDrawPolygon, 
  FaEdit, 
  FaDownload, 
  FaUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './MapaInteractivo.scss';

// Fix para iconos de Leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaInteractivo = () => {
  const [polygons, setPolygons] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [layers, setLayers] = useState({
    distritos: true,
    zonas: true,
    sectores: true
  });
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const fileInputRef = useRef(null); // ← AGREGAR

  // Centro del mapa (Lima, Perú)
  const center = [-12.0464, -77.0428];

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      const [polygonsRes, statsRes] = await Promise.all([
        mapService.getPolygons(),
        mapService.getStatistics()
      ]);
      setPolygons(polygonsRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error al cargar datos del mapa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLayerToggle = (layer) => {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const handleValidate = async () => {
    try {
      setLoading(true);
      const result = await mapService.validatePolygons();
      
      // Mostrar resultado de validación
      const message = `
✅ Validación completada

📍 Coordenadas: ${result.data.coordinates}
⚠️ Sectores sin asignar: ${result.data.unassignedSectors}
📊 Estado: ${result.data.message}
      `;
      
      alert(message.trim());
      
      // Recargar datos para actualizar estadísticas
      loadMapData();
    } catch (error) {
      console.error('Error en validación:', error);
      alert('Error al validar polígonos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      
      // Preparar datos para exportación
      const dataToExport = polygons.map(polygon => ({
        'ID': polygon.id,
        'Nombre': polygon.name,
        'Tipo': polygon.type,
        'Distrito': polygon.distrito || '-',
        'Zona': polygon.zona || '-',
        'Zonas': polygon.zonas || 0,
        'Sectores': polygon.sectores || 0,
        'Personal': polygon.personal || 0,
        'Coordenadas': `${polygon.coordinates.length} puntos`,
        'Color': polygon.color
      }));

      if (dataToExport.length === 0) {
        alert('⚠️ No hay polígonos para exportar');
        setLoading(false);
        return;
      }

      await showExportModal(
        () => {
          try {
            exportToExcel(dataToExport, 'Mapa_Territorial_FieldOps');
            alert('✅ Datos del mapa exportados a Excel exitosamente');
          } catch (error) {
            alert('❌ Error al exportar a Excel: ' + error.message);
          }
        },
        () => {
          try {
            exportToPDF(dataToExport, 'Mapa_Territorial_FieldOps');
            alert('✅ Abriendo vista previa de impresión para PDF');
          } catch (error) {
            alert('❌ Error al exportar a PDF: ' + error.message);
          }
        }
      );
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('❌ Error al exportar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawPolygon = () => {
    alert(`
🖊️ Herramienta Draw Polygon

Esta funcionalidad permite dibujar nuevos polígonos en el mapa.

📋 Funcionalidad requerida en el backend:
- Guardar coordenadas del polígono dibujado
- Asignar tipo (distrito/zona/sector)
- Validar que no se solape con otros polígonos
- Calcular área y perímetro

🔧 Frontend: Se requiere librería de dibujo (Leaflet.draw)
    `);
  };

  const handleEditExisting = () => {
    if (!selectedPolygon) {
      alert('⚠️ Primero selecciona un polígono en el mapa haciendo click sobre él');
      return;
    }
    
    alert(`
✏️ Editar Polígono: ${selectedPolygon.name}

📋 Información actual:
- Tipo: ${selectedPolygon.type}
- Coordenadas: ${selectedPolygon.coordinates.length} puntos
${selectedPolygon.zonas ? `- Zonas: ${selectedPolygon.zonas}` : ''}
${selectedPolygon.sectores ? `- Sectores: ${selectedPolygon.sectores}` : ''}
- Personal: ${selectedPolygon.personal || 0}

🔧 Funcionalidad de edición en desarrollo:
- Mover vértices del polígono
- Agregar/eliminar puntos
- Cambiar propiedades (nombre, tipo, etc.)
    `);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar extensión
    const validExtensions = ['.kml', '.kmz'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      alert('❌ Por favor, selecciona un archivo KML o KMZ válido');
      return;
    }

    try {
      setLoading(true);
      
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      
      alert(`
✅ Archivo "${file.name}" seleccionado correctamente

📋 Información del archivo:
- Nombre: ${file.name}
- Tamaño: ${(file.size / 1024).toFixed(2)} KB
- Tipo: ${file.type || 'application/vnd.google-earth.kml+xml'}

🔧 Funcionalidad de backend pendiente:
1. Parsear archivo KML/KMZ
2. Extraer coordenadas y propiedades
3. Validar estructura de datos
4. Crear polígonos en base de datos
5. Asignar a distrito/zona/sector correspondiente

📡 Endpoint sugerido: POST /api/map/import-kml/
      `);
      
      // Cuando el backend esté listo, descomentar:
      /*
      const response = await mapService.importKML(formData);
      alert('✅ Archivo importado exitosamente\n\n' + response.message);
      loadMapData();
      */
      
    } catch (error) {
      console.error('Error al importar archivo:', error);
      alert('❌ Error al importar archivo: ' + error.message);
    } finally {
      setLoading(false);
      // Limpiar input
      e.target.value = '';
    }
  };

  const getFilteredPolygons = () => {
    return polygons.filter(polygon => {
      if (polygon.type === 'distrito') return layers.distritos;
      if (polygon.type === 'zona') return layers.zonas;
      if (polygon.type === 'sector') return layers.sectores;
      return false;
    });
  };

  return (
    <div className="mapa-interactivo-page">
      {/* Sidebar Panel */}
      {showPanel && (
        <div className="map-sidebar">
          <div className="sidebar-header">
            <h2>Capas territoriales</h2>
            <button 
              className="close-btn"
              onClick={() => setShowPanel(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Capas */}
          <div className="layers-section">
            <div className="layer-item">
              <label className="layer-label">
                <input
                  type="checkbox"
                  checked={layers.distritos}
                  onChange={() => handleLayerToggle('distritos')}
                />
                <span>Distrito ({statistics?.districts || 0})</span>
              </label>
            </div>
            <div className="layer-item">
              <label className="layer-label">
                <input
                  type="checkbox"
                  checked={layers.zonas}
                  onChange={() => handleLayerToggle('zonas')}
                />
                <span>Zonas ({statistics?.zones || 0})</span>
              </label>
            </div>
            <div className="layer-item">
              <label className="layer-label">
                <input
                  type="checkbox"
                  checked={layers.sectores}
                  onChange={() => handleLayerToggle('sectores')}
                />
                <span>Sectores ({statistics?.sectors || 0})</span>
              </label>
            </div>
          </div>

          {/* Herramientas */}
          <div className="tools-section">
            <h3>Herramientas de dibujo</h3>
            <Button
              variant="outline"
              icon={<FaDrawPolygon />}
              fullWidth
              onClick={handleDrawPolygon} // ← CAMBIAR
            >
              Draw Polygon
            </Button>
            <Button
              variant="outline"
              icon={<FaEdit />}
              fullWidth
              onClick={handleEditExisting} // ← CAMBIAR
            >
              Edit Existing
            </Button>
            <Button
              variant="outline"
              icon={<FaUpload />}
              fullWidth
              onClick={handleImport}
            >
              Import KML/KMZ
            </Button>
            <Button
              variant="outline"
              icon={<FaDownload />}
              fullWidth
              onClick={handleExport}
            >
              Export Data
            </Button>
          </div>
          {/* Botón de validación */}
          <div className="validation-button-section">
            <Button
              variant="primary"
              icon={<FaCheckCircle />}
              fullWidth
              onClick={handleValidate}
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Validar Polígonos'}
            </Button>
          </div>

          {/* Información actual */}
          {selectedPolygon && (
            <div className="current-info">
              <h3>CURRENT INFORMATION</h3>
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{selectedPolygon.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Zones Count</span>
                <span className="info-value">{selectedPolygon.zonas || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Sectors Count</span>
                <span className="info-value">{selectedPolygon.sectores || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Personnel Nº</span>
                <span className="info-value">{selectedPolygon.personal || 0}</span>
              </div>
            </div>
          )}

          {/* Alertas de validación */}
          <div className="validation-section">
            <h3>VALIDATION ALERTS</h3>
            <div className="validation-item success">
              <FaCheckCircle />
              <span>Validation successful</span>
              <span className="validation-coords">37,661, -122,055</span>
            </div>
            {statistics?.unassignedSectors > 0 && (
              <div className="validation-item warning">
                <FaExclamationTriangle />
                <span>{statistics.unassignedSectors} unassigned sectors</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mapa */}
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Renderizar polígonos */}
          {getFilteredPolygons().map((polygon) => (
            <Polygon
              key={polygon.id}
              positions={polygon.coordinates}
              pathOptions={{
                color: polygon.color,
                fillColor: polygon.color,
                fillOpacity: 0.4
              }}
              eventHandlers={{
                click: () => setSelectedPolygon(polygon)
              }}
            >
              <Popup>
                <div className="polygon-popup">
                  <h4>{polygon.name}</h4>
                  <p>Tipo: {polygon.type}</p>
                  {polygon.personal && <p>Personal: {polygon.personal}</p>}
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>

        {/* Panel de estadísticas flotante */}
        {statistics && (
          <div className="statistics-panel">
            <h3>STATISTICS</h3>
            <div className="stat-item">
              <span className="stat-label">Districts</span>
              <span className="stat-value">{statistics.districts}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Zones</span>
              <span className="stat-value">{statistics.zones}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sectors</span>
              <span className="stat-value">{statistics.sectors}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Coverage</span>
              <span className="stat-value">{statistics.coverage}%</span>
            </div>
          </div>
        )}

        {/* Botón para abrir panel */}
        {!showPanel && (
          <button
            className="open-panel-btn"
            onClick={() => setShowPanel(true)}
          >
            ☰
          </button>
        )}
      </div>

      {/* Input oculto para importar archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".kml,.kmz"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MapaInteractivo;