// Mock data para polígonos territoriales
const mockPolygons = [
  {
    id: 'D01',
    name: 'D01',
    type: 'distrito',
    coordinates: [
      [-12.0464, -77.0428],
      [-12.0364, -77.0428],
      [-12.0364, -77.0328],
      [-12.0464, -77.0328]
    ],
    color: '#3B82F6',
    zonas: 3,
    sectores: 12,
    personal: 18
  },
  {
    id: 'Z01',
    name: 'Z01',
    type: 'zona',
    distrito: 'D01',
    coordinates: [
      [-12.0464, -77.0528],
      [-12.0364, -77.0528],
      [-12.0364, -77.0428],
      [-12.0464, -77.0428]
    ],
    color: '#FBBF24',
    sectores: 4,
    personal: 6
  },
  {
    id: 'Z01S01',
    name: 'Z01S01',
    type: 'sector',
    zona: 'Z01',
    distrito: 'D01',
    coordinates: [
      [-12.0564, -77.0628],
      [-12.0464, -77.0628],
      [-12.0464, -77.0528],
      [-12.0564, -77.0528]
    ],
    color: '#F472B6',
    personal: 2
  },
  {
    id: 'D02',
    name: 'D02',
    type: 'distrito',
    coordinates: [
      [-12.0264, -77.0428],
      [-12.0164, -77.0428],
      [-12.0164, -77.0328],
      [-12.0264, -77.0328]
    ],
    color: '#10B981',
    zonas: 2,
    sectores: 8,
    personal: 12
  },
  {
    id: 'Z02',
    name: 'Z02',
    type: 'zona',
    distrito: 'D02',
    coordinates: [
      [-12.0264, -77.0228],
      [-12.0164, -77.0228],
      [-12.0164, -77.0128],
      [-12.0264, -77.0128]
    ],
    color: '#8B5CF6',
    sectores: 3,
    personal: 5
  }
];

const mapService = {
  // Obtener todos los polígonos
  getPolygons: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockPolygons }), 300);
    });
  },

  // Obtener estadísticas
  getStatistics: () => {
    return new Promise((resolve) => {
      const stats = {
        districts: mockPolygons.filter(p => p.type === 'distrito').length,
        zones: mockPolygons.filter(p => p.type === 'zona').length,
        sectors: mockPolygons.filter(p => p.type === 'sector').length,
        coverage: 96, // porcentaje
        totalPersonnel: 1123,
        unassignedSectors: 2
      };
      setTimeout(() => resolve({ data: stats }), 300);
    });
  },

  // Guardar nuevo polígono
  savePolygon: (polygonData) => {
    return new Promise((resolve) => {
      const newPolygon = {
        id: `NEW_${Date.now()}`,
        ...polygonData,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };
      mockPolygons.push(newPolygon);
      setTimeout(() => resolve({ data: newPolygon }), 500);
    });
  },

  // Validar polígonos
  validatePolygons: () => {
    return new Promise((resolve) => {
      const validation = {
        success: true,
        coordinates: '37,661, -122,055',
        unassignedSectors: 2,
        message: 'Validation successful'
      };
      setTimeout(() => resolve({ data: validation }), 500);
    });
  },

  // Importar archivo KML/KMZ
  importKML: (formData) => {
    return new Promise((resolve, reject) => {
      // Cuando el backend esté listo:
      // return fetch('http://31.97.91.123:8000/api/map/import-kml/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: formData
      // }).then(res => res.json());
      
      // Mock por ahora
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: 'Archivo procesado (mock)',
          polygons: []
        });
      }, 1000);
    });
  }
};

export default mapService;