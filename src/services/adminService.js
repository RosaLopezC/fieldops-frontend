// Mock data para Supervisores
const mockSupervisores = [
  {
    id: 1,
    dni: '12345678',
    nombres: 'Carlos',
    apellidos: 'Ramírez',
    email: 'carlos.ramirez@example.com',
    celular: '987654321',
    estado: 'activo',
    fecha_creacion: '2024-01-15'
  },
  {
    id: 2,
    dni: '87654321',
    nombres: 'María',
    apellidos: 'Torres',
    email: 'maria.torres@example.com',
    celular: '912345678',
    estado: 'activo',
    fecha_creacion: '2024-02-20'
  },
  {
    id: 3,
    dni: '45678912',
    nombres: 'José',
    apellidos: 'López',
    email: 'jose.lopez@example.com',
    celular: '923456789',
    estado: 'inactivo',
    fecha_creacion: '2024-03-10'
  }
];

// Mock data para Encargados
const mockEncargados = [
  {
    id: 1,
    dni: '74951060',
    nombres: 'Rosa',
    apellidos: 'López',
    email: 'rosalopez@gmail.com',
    celular: '998877665',
    supervisor: 1,
    supervisor_nombre: 'Carlos Ramírez',
    estado: 'activo',
    fecha_creacion: '2024-01-20'
  },
  {
    id: 2,
    dni: '85236974',
    nombres: 'Pedro',
    apellidos: 'Sánchez',
    email: 'pedro.sanchez@gmail.com',
    celular: '987123456',
    supervisor: 1,
    supervisor_nombre: 'Carlos Ramírez',
    estado: 'activo',
    fecha_creacion: '2024-02-15'
  },
  {
    id: 3,
    dni: '96385274',
    nombres: 'Ana',
    apellidos: 'García',
    email: 'ana.garcia@gmail.com',
    celular: '976543210',
    supervisor: 2,
    supervisor_nombre: 'María Torres',
    estado: 'activo',
    fecha_creacion: '2024-03-05'
  },
  {
    id: 4,
    dni: '74185296',
    nombres: 'Luis',
    apellidos: 'Martínez',
    email: 'luis.martinez@gmail.com',
    celular: '965432109',
    supervisor: 2,
    supervisor_nombre: 'María Torres',
    estado: 'inactivo',
    fecha_creacion: '2024-03-20'
  }
];

// Mock data para Reportes del Admin
const mockReportesAdmin = [
  {
    id: 298523,
    tipo: 'Poste',
    codigo: 'PZ10S1004',
    distrito: 'LOS OLIVOS',
    zona: 'Z10',
    sector: 'Z10S11',
    encargado: 'Omar Urteaga Olanegui',
    supervisor: 'Carlos Ramírez',
    fecha: '02-02-2024 15:20:45',
    estado: 'Registrado'
  },
  {
    id: 984231,
    tipo: 'Poste',
    codigo: 'PZ10S11012',
    distrito: 'LOS OLIVOS',
    zona: 'Z10',
    sector: 'Z10S11',
    encargado: 'Daphne Medina Jimenez',
    supervisor: 'Carlos Ramírez',
    fecha: '02-02-2024 15:52:10',
    estado: 'Registrado'
  },
  {
    id: 854235,
    tipo: 'Poste',
    codigo: 'PZ10S11015',
    distrito: 'LOS OLIVOS',
    zona: 'Z10',
    sector: 'Z10S11',
    encargado: 'Jenny Montero Galarza',
    supervisor: 'María Torres',
    fecha: '02-02-2024 16:15:25',
    estado: 'Pendiente'
  },
  {
    id: 963258,
    tipo: 'Poste',
    codigo: 'PZ20S11045',
    distrito: 'SAN JUAN',
    zona: 'Z20',
    sector: 'Z20S11',
    encargado: 'María López',
    supervisor: 'María Torres',
    fecha: '03-02-2024 10:15:45',
    estado: 'Observado'
  }
];

const adminService = {
  // ============== SUPERVISORES ==============
  getSupervisors: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockSupervisores }), 500);
    });
  },

  createSupervisor: (supervisorData) => {
    return new Promise((resolve) => {
      const newSupervisor = {
        id: mockSupervisores.length + 1,
        ...supervisorData,
        estado: 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0]
      };
      mockSupervisores.push(newSupervisor);
      setTimeout(() => resolve({ data: newSupervisor }), 500);
    });
  },

  updateSupervisor: (id, supervisorData) => {
    return new Promise((resolve) => {
      const index = mockSupervisores.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSupervisores[index] = {
          ...mockSupervisores[index],
          ...supervisorData
        };
        resolve({ data: mockSupervisores[index] });
      } else {
        resolve({ data: null });
      }
    }, 500);
  },

  deleteSupervisor: (id) => {
    return new Promise((resolve) => {
      const index = mockSupervisores.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSupervisores.splice(index, 1);
      }
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  // ============== ENCARGADOS ==============
  getEncargados: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockEncargados }), 500);
    });
  },

  createEncargado: (encargadoData) => {
    return new Promise((resolve) => {
      // Buscar nombre del supervisor
      const supervisor = mockSupervisores.find(s => s.id === parseInt(encargadoData.supervisor));
      const newEncargado = {
        id: mockEncargados.length + 1,
        ...encargadoData,
        supervisor_nombre: supervisor ? `${supervisor.nombres} ${supervisor.apellidos}` : 'Sin asignar',
        estado: 'activo',
        fecha_creacion: new Date().toISOString().split('T')[0]
      };
      mockEncargados.push(newEncargado);
      setTimeout(() => resolve({ data: newEncargado }), 500);
    });
  },

  updateEncargado: (id, encargadoData) => {
    return new Promise((resolve) => {
      const index = mockEncargados.findIndex(e => e.id === id);
      if (index !== -1) {
        // Buscar nombre del supervisor si cambió
        if (encargadoData.supervisor) {
          const supervisor = mockSupervisores.find(s => s.id === parseInt(encargadoData.supervisor));
          encargadoData.supervisor_nombre = supervisor ? `${supervisor.nombres} ${supervisor.apellidos}` : 'Sin asignar';
        }
        mockEncargados[index] = {
          ...mockEncargados[index],
          ...encargadoData
        };
        resolve({ data: mockEncargados[index] });
      } else {
        resolve({ data: null });
      }
    }, 500);
  },

  deleteEncargado: (id) => {
    return new Promise((resolve) => {
      const index = mockEncargados.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEncargados.splice(index, 1);
      }
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  // ============== REPORTES ==============
  getReportes: (filters = {}) => {
    return new Promise((resolve) => {
      let filteredReportes = [...mockReportesAdmin];

      // Aplicar filtros si existen
      if (filters.estado && filters.estado !== 'todos') {
        filteredReportes = filteredReportes.filter(r => r.estado === filters.estado);
      }

      if (filters.distrito && filters.distrito !== '') {
        filteredReportes = filteredReportes.filter(r => 
          r.distrito.toLowerCase().includes(filters.distrito.toLowerCase())
        );
      }

      if (filters.zona && filters.zona !== '') {
        filteredReportes = filteredReportes.filter(r => r.zona === filters.zona);
      }

      setTimeout(() => resolve({ data: filteredReportes }), 500);
    });
  },

  // ============== DETALLE DE REPORTE ==============
  getReporteDetalle: (reporteId) => {
    return new Promise((resolve) => {
      const reporteDetalle = {
        id: reporteId,
        codigo: 'PZ10S11012',
        tipo: 'Poste Eléctrico',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector: 'Z10S11',
        encargado: {
          nombre: 'Daphne Medina Jimenez',
          dni: '74951060',
          celular: '998877665'
        },
        supervisor: {
          nombre: 'Carlos Ramírez',
          dni: '12345678'
        },
        fecha_registro: '02-02-2024 15:52:10',
        estado: 'Registrado',

        // Datos del poste
        poste: {
          material: 'Concreto',
          tipo_estructura: 'Poste simple',
          altura: '12 metros',
          resistencia: 'Alta',
          estado_fisico: 'Bueno',
          inclinacion: 'Sin inclinación',
          propietario: 'Luz del Sur',
          zona_instalacion: 'Vereda'
        },

        // Cables y elementos
        cables: {
          cable_cobre: 'Sí',
          fibra_optica: 'No',
          cable_television: 'Sí',
          numero_cables: 5
        },

        // Ubicación GPS
        gps: {
          latitud: -12.0464,
          longitud: -77.0428,
          precision: '5 metros',
          timestamp: '02-02-2024 15:52:08'
        },

        // Fotos
        fotos: [
          {
            id: 1,
            url: 'https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Foto+1+Poste',
            descripcion: 'Vista frontal del poste',
            timestamp: '02-02-2024 15:52:10',
            obligatoria: true
          },
          {
            id: 2,
            url: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Foto+2+Cables',
            descripcion: 'Detalle de cables',
            timestamp: '02-02-2024 15:52:15',
            obligatoria: true
          },
          {
            id: 3,
            url: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Foto+3+Placa',
            descripcion: 'Placa identificadora',
            timestamp: '02-02-2024 15:52:20',
            obligatoria: false
          }
        ],

        // Observaciones
        observaciones: 'Poste en buen estado. Se recomienda mantenimiento preventivo en 6 meses.',

        // Comentarios del supervisor (si está observado)
        comentarios_supervisor: null,

        // Historial de estados
        historial: [
          {
            estado: 'Registrado',
            fecha: '02-02-2024 15:52:10',
            usuario: 'Daphne Medina Jimenez',
            comentario: 'Reporte creado'
          }
        ]
      };

      setTimeout(() => resolve({ data: reporteDetalle }), 500);
    });
  }
}; // ← IMPORTANTE: Cerrar el objeto adminService

export default adminService; // ← IMPORTANTE: Exportar