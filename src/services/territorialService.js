// Mock data para Distritos
const mockDistritos = [
  {
    id: 'D01',
    nombre: 'Lima Centro',
    zonas: 5,
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'D02',
    nombre: 'San Isidro',
    zonas: 5,
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'D03',
    nombre: 'Miraflores',
    zonas: 5,
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'D04',
    nombre: 'Miraflores',
    zonas: 5,
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'D05',
    nombre: 'Miraflores',
    zonas: 5,
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'inactivo'
  },
  {
    id: 'D06',
    nombre: 'Miraflores',
    zonas: 5,
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  }
];

// Mock data para Zonas
const mockZonas = [
  {
    id: 'Z01',
    distrito: 'San Juan de Miraflores',
    distrito_id: 'D01',
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'Z02',
    distrito: 'San Isidro',
    distrito_id: 'D02',
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'Z01',
    distrito: 'Miraflores',
    distrito_id: 'D03',
    sectores: 12,
    personal_asignado: '3 supervisores / 16 encargados',
    supervisores: 3,
    encargados: 16,
    estado: 'activo'
  },
  {
    id: 'Z04',
    distrito: 'San Isidro',
    distrito_id: 'D02',
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  },
  {
    id: 'Z05',
    distrito: 'San Isidro',
    distrito_id: 'D02',
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'inactivo'
  },
  {
    id: 'Z06',
    distrito: 'San Isidro',
    distrito_id: 'D02',
    sectores: 12,
    personal_asignado: '3 supervisores / 15 encargados',
    supervisores: 3,
    encargados: 15,
    estado: 'activo'
  }
];

// Mock data para Sectores
const mockSectores = [
  {
    id: 'Z01S01',
    distrito: 'San Juan de Miraflores',
    zona: 'Z01',
    supervisor_asignado: 'Jaime López Vergara',
    supervisor_id: 1,
    encargados: 6,
    estado: 'activo'
  },
  {
    id: 'Z01S01',
    distrito: 'San Isidro',
    zona: 'Z01',
    supervisor_asignado: 'Jaime López Vergara',
    supervisor_id: 1,
    encargados: 6,
    estado: 'activo'
  },
  {
    id: 'Z01S01',
    distrito: 'Miraflores',
    zona: 'Z01',
    supervisor_asignado: 'Jaime López Vergara',
    supervisor_id: 1,
    encargados: 5,
    estado: 'activo'
  },
  {
    id: 'Z01S01',
    distrito: 'San Isidro',
    zona: 'Z01',
    supervisor_asignado: 'Jaime López Vergara',
    supervisor_id: 1,
    encargados: 6,
    estado: 'activo'
  },
  {
    id: 'Z01S01',
    distrito: 'San Isidro',
    zona: 'Z01',
    supervisor_asignado: 'Jaime López Vergara',
    supervisor_id: 1,
    encargados: 6,
    estado: 'inactivo'
  },
  {
    id: 'Z01S01',
    distrito: 'San Isidro',
    zona: 'Z01',
    supervisor_asignado: 'Jaime López Vergara',
    supervisor_id: 1,
    encargados: 6,
    estado: 'activo'
  }
];

const territorialService = {
  // ============== DISTRITOS ==============
  getDistritos: (filters = {}) => {
    return new Promise((resolve) => {
      let filtered = [...mockDistritos];

      if (filters.search) {
        filtered = filtered.filter(d => 
          d.nombre.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.estado && filters.estado !== 'todos') {
        filtered = filtered.filter(d => d.estado === filters.estado);
      }

      setTimeout(() => resolve({ data: filtered }), 500);
    });
  },

  createDistrito: (distritoData) => {
    return new Promise((resolve) => {
      const newDistrito = {
        id: `D${String(mockDistritos.length + 1).padStart(2, '0')}`,
        ...distritoData,
        zonas: 0,
        sectores: 0,
        personal_asignado: '0 supervisores / 0 encargados',
        supervisores: 0,
        encargados: 0,
        estado: 'activo'
      };
      mockDistritos.push(newDistrito);
      setTimeout(() => resolve({ data: newDistrito }), 500);
    });
  },

  updateDistrito: (id, distritoData) => {
    return new Promise((resolve) => {
      const index = mockDistritos.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDistritos[index] = {
          ...mockDistritos[index],
          ...distritoData
        };
        resolve({ data: mockDistritos[index] });
      } else {
        resolve({ data: null });
      }
    }, 500);
  },

  deleteDistrito: (id) => {
    return new Promise((resolve) => {
      const index = mockDistritos.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDistritos.splice(index, 1);
      }
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  // ============== ZONAS ==============
  getZonas: (filters = {}) => {
    return new Promise((resolve) => {
      let filtered = [...mockZonas];

      if (filters.search) {
        filtered = filtered.filter(z => 
          z.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          z.distrito.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.estado && filters.estado !== 'todos') {
        filtered = filtered.filter(z => z.estado === filters.estado);
      }

      setTimeout(() => resolve({ data: filtered }), 500);
    });
  },

  createZona: (zonaData) => {
    return new Promise((resolve) => {
      const newZona = {
        id: `Z${String(mockZonas.length + 1).padStart(2, '0')}`,
        ...zonaData,
        sectores: 0,
        personal_asignado: '0 supervisores / 0 encargados',
        supervisores: 0,
        encargados: 0,
        estado: 'activo'
      };
      mockZonas.push(newZona);
      setTimeout(() => resolve({ data: newZona }), 500);
    });
  },

  updateZona: (id, zonaData) => {
    return new Promise((resolve) => {
      const index = mockZonas.findIndex(z => z.id === id);
      if (index !== -1) {
        mockZonas[index] = {
          ...mockZonas[index],
          ...zonaData
        };
        resolve({ data: mockZonas[index] });
      } else {
        resolve({ data: null });
      }
    }, 500);
  },

  deleteZona: (id) => {
    return new Promise((resolve) => {
      const index = mockZonas.findIndex(z => z.id === id);
      if (index !== -1) {
        mockZonas.splice(index, 1);
      }
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  // ============== SECTORES ==============
  getSectores: (filters = {}) => {
    return new Promise((resolve) => {
      let filtered = [...mockSectores];

      if (filters.search) {
        filtered = filtered.filter(s => 
          s.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.zona.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.estado && filters.estado !== 'todos') {
        filtered = filtered.filter(s => s.estado === filters.estado);
      }

      setTimeout(() => resolve({ data: filtered }), 500);
    });
  },

  createSector: (sectorData) => {
    return new Promise((resolve) => {
      const newSector = {
        ...sectorData,
        encargados: 0,
        estado: 'activo'
      };
      mockSectores.push(newSector);
      setTimeout(() => resolve({ data: newSector }), 500);
    });
  },

  updateSector: (id, sectorData) => {
    return new Promise((resolve) => {
      const index = mockSectores.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSectores[index] = {
          ...mockSectores[index],
          ...sectorData
        };
        resolve({ data: mockSectores[index] });
      } else {
        resolve({ data: null });
      }
    }, 500);
  },

  deleteSector: (id) => {
    return new Promise((resolve) => {
      const index = mockSectores.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSectores.splice(index, 1);
      }
      setTimeout(() => resolve({ success: true }), 500);
    });
  }
};

export default territorialService;