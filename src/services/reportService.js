import api from '../config/api';

/**
 * Servicio para gestionar reportes
 * Basado en tu API de reportes de postes
 */

class ReportService {
  /**
   * Obtener todos los reportes (TEMPORAL CON DATOS MOCK)
   */
  async getReports(filters = {}) {
    console.log('⚠️ [ReportService] USANDO DATOS MOCK - El endpoint real no existe');
    
    // DATOS DE PRUEBA TEMPORALES (20 reportes) con TODAS las columnas
    const mockReports = [
      {
        id: 298523,
        tipo: 'Poste',
        codigo_poste: 'PZ10S1004',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S11',
        encargado_nombre: 'Omar Urteaga Olanegui',
        fecha_reporte: '02-02-2024 15:20:45',
        estado: 'registrado',
        latitud: -12.04318,
        longitud: -77.02824,
        observaciones: 'Poste en buen estado'
      },
      {
        id: 152364,
        tipo: 'Predio',
        codigo_poste: 'PZ10S12402',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S11',
        encargado_nombre: 'Henry Jurgen Carranza',
        fecha_reporte: '02-02-2024 15:31:20',
        estado: 'registrado',
        latitud: -12.05123,
        longitud: -77.03456,
        observaciones: 'Predio residencial'
      },
      {
        id: 281642,
        tipo: 'Predio',
        codigo_poste: 'PZ10S11144',
        distrito: 'INDEPENDENCIA',
        zona: 'Z10',
        sector_nombre: 'Z10S11',
        encargado_nombre: 'Willy Panduro Morales',
        fecha_reporte: '02-02-2024 15:45:15',
        estado: 'registrado',
        latitud: -12.06234,
        longitud: -77.04567,
        observaciones: 'Vivienda multifamiliar'
      },
      {
        id: 984231,
        tipo: 'Poste',
        codigo_poste: 'PZ10S11012',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S11',
        encargado_nombre: 'Daphne Medina Jimenez',
        fecha_reporte: '02-02-2024 15:52:10',
        estado: 'registrado',
        latitud: -12.07345,
        longitud: -77.05678,
        observaciones: 'Poste con cableado telemático'
      },
      {
        id: 987452,
        tipo: 'Predio',
        codigo_poste: 'PZ10S11036',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S11',
        encargado_nombre: 'José Perales Poma',
        fecha_reporte: '02-02-2024 16:02:38',
        estado: 'registrado',
        latitud: -12.08456,
        longitud: -77.06789,
        observaciones: 'Predio comercial'
      },
      {
        id: 854235,
        tipo: 'Poste',
        codigo_poste: 'PZ10S11015',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S11',
        encargado_nombre: 'Jenny Montero Galarza',
        fecha_reporte: '02-02-2024 16:15:25',
        estado: 'pendiente',
        latitud: -12.09567,
        longitud: -77.07890,
        observaciones: 'Requiere revisión'
      },
      {
        id: 741258,
        tipo: 'Predio',
        codigo_poste: 'PZ20S11023',
        distrito: 'SAN JUAN',
        zona: 'Z20',
        sector_nombre: 'Z20S11',
        encargado_nombre: 'Carlos Rivera',
        fecha_reporte: '03-02-2024 09:30:12',
        estado: 'completado',
        latitud: -12.10678,
        longitud: -77.08901,
        observaciones: 'Instalación completada'
      },
      {
        id: 963258,
        tipo: 'Poste',
        codigo_poste: 'PZ20S11045',
        distrito: 'SAN JUAN',
        zona: 'Z20',
        sector_nombre: 'Z20S11',
        encargado_nombre: 'María Lopez',
        fecha_reporte: '03-02-2024 10:15:45',
        estado: 'observado',
        latitud: -12.11789,
        longitud: -77.09012,
        observaciones: 'Poste inclinado'
      },
      {
        id: 852147,
        tipo: 'Predio',
        codigo_poste: 'PZ20S11067',
        distrito: 'SAN JUAN',
        zona: 'Z20',
        sector_nombre: 'Z20S11',
        encargado_nombre: 'Ana Torres',
        fecha_reporte: '03-02-2024 11:22:30',
        estado: 'registrado',
        latitud: -12.12890,
        longitud: -77.10123,
        observaciones: 'Predio sin conexión'
      },
      {
        id: 741369,
        tipo: 'Poste',
        codigo_poste: 'PZ30S11089',
        distrito: 'INDEPENDENCIA',
        zona: 'Z30',
        sector_nombre: 'Z30S11',
        encargado_nombre: 'Pedro Sanchez',
        fecha_reporte: '03-02-2024 12:45:50',
        estado: 'pendiente',
        latitud: -12.13901,
        longitud: -77.11234,
        observaciones: 'Pendiente de validación'
      },
      {
        id: 963147,
        tipo: 'Predio',
        codigo_poste: 'PZ30S11112',
        distrito: 'INDEPENDENCIA',
        zona: 'Z30',
        sector_nombre: 'Z30S11',
        encargado_nombre: 'Laura Castillo',
        fecha_reporte: '03-02-2024 14:10:20',
        estado: 'completado',
        latitud: -12.15012,
        longitud: -77.12345,
        observaciones: 'Trabajo finalizado'
      },
      {
        id: 852369,
        tipo: 'Poste',
        codigo_poste: 'PZ10S12134',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S12',
        encargado_nombre: 'Diego Ramirez',
        fecha_reporte: '04-02-2024 08:30:15',
        estado: 'registrado',
        latitud: -12.16123,
        longitud: -77.13456,
        observaciones: 'Nuevo poste instalado'
      },
      {
        id: 741852,
        tipo: 'Predio',
        codigo_poste: 'PZ10S12156',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S12',
        encargado_nombre: 'Sofia Herrera',
        fecha_reporte: '04-02-2024 09:45:30',
        estado: 'observado',
        latitud: -12.17234,
        longitud: -77.14567,
        observaciones: 'Falta documentación'
      },
      {
        id: 963741,
        tipo: 'Poste',
        codigo_poste: 'PZ20S12178',
        distrito: 'SAN JUAN',
        zona: 'Z20',
        sector_nombre: 'Z20S12',
        encargado_nombre: 'Jorge Mendoza',
        fecha_reporte: '04-02-2024 11:20:45',
        estado: 'pendiente',
        latitud: -12.18345,
        longitud: -77.15678,
        observaciones: 'Inspección programada'
      },
      {
        id: 852741,
        tipo: 'Predio',
        codigo_poste: 'PZ20S12190',
        distrito: 'SAN JUAN',
        zona: 'Z20',
        sector_nombre: 'Z20S12',
        encargado_nombre: 'Patricia Silva',
        fecha_reporte: '04-02-2024 13:35:20',
        estado: 'completado',
        latitud: -12.19456,
        longitud: -77.16789,
        observaciones: 'Instalación verificada'
      },
      {
        id: 741963,
        tipo: 'Poste',
        codigo_poste: 'PZ30S12212',
        distrito: 'INDEPENDENCIA',
        zona: 'Z30',
        sector_nombre: 'Z30S12',
        encargado_nombre: 'Ricardo Vargas',
        fecha_reporte: '05-02-2024 08:15:10',
        estado: 'registrado',
        latitud: -12.20567,
        longitud: -77.17890,
        observaciones: 'Registro completo'
      },
      {
        id: 963852,
        tipo: 'Predio',
        codigo_poste: 'PZ30S12234',
        distrito: 'INDEPENDENCIA',
        zona: 'Z30',
        sector_nombre: 'Z30S12',
        encargado_nombre: 'Gabriela Rojas',
        fecha_reporte: '05-02-2024 10:40:25',
        estado: 'pendiente',
        latitud: -12.21678,
        longitud: -77.18901,
        observaciones: 'Pendiente de aprobación'
      },
      {
        id: 852963,
        tipo: 'Poste',
        codigo_poste: 'PZ10S13256',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S13',
        encargado_nombre: 'Fernando Cruz',
        fecha_reporte: '05-02-2024 12:55:40',
        estado: 'observado',
        latitud: -12.22789,
        longitud: -77.19012,
        observaciones: 'Necesita reparación'
      },
      {
        id: 741654,
        tipo: 'Predio',
        codigo_poste: 'PZ10S13278',
        distrito: 'LOS OLIVOS',
        zona: 'Z10',
        sector_nombre: 'Z10S13',
        encargado_nombre: 'Valeria Ortiz',
        fecha_reporte: '05-02-2024 15:10:55',
        estado: 'completado',
        latitud: -12.23890,
        longitud: -77.20123,
        observaciones: 'Conexión activa'
      },
      {
        id: 963456,
        tipo: 'Poste',
        codigo_poste: 'PZ20S13290',
        distrito: 'SAN JUAN',
        zona: 'Z20',
        sector_nombre: 'Z20S13',
        encargado_nombre: 'Andres Morales',
        fecha_reporte: '06-02-2024 09:25:30',
        estado: 'registrado',
        latitud: -12.24901,
        longitud: -77.21234,
        observaciones: 'Estructura verificada'
      }
    ];

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Aplicar filtros
    let filteredReports = [...mockReports];

    if (filters.distrito) {
      filteredReports = filteredReports.filter(r => r.distrito === filters.distrito);
    }

    if (filters.zona) {
      filteredReports = filteredReports.filter(r => r.zona === filters.zona);
    }

    if (filters.sector) {
      filteredReports = filteredReports.filter(r => r.sector_nombre === filters.sector);
    }

    // ← MODIFICADO ESTA PARTE
    if (filters.tipo) {
      filteredReports = filteredReports.filter(r => 
        r.tipo.toLowerCase() === filters.tipo.toLowerCase()
      );
    }

    if (filters.estado) {
      filteredReports = filteredReports.filter(r => r.estado === filters.estado);
    }

    if (filters.search) {
      filteredReports = filteredReports.filter(r => 
        r.id.toString().includes(filters.search)
      );
    }

    console.log('✅ [ReportService] Devolviendo', filteredReports.length, 'reportes MOCK (de', mockReports.length, 'totales)');
    
    return filteredReports;
  }

  /**
   * Obtener detalle de un reporte específico
   * Según tu doc: GET /api/postes/reportes/{id}/
   * @param {number} reporteId 
   * @returns {Promise<Object>}
   */
  async getReportDetail(reporteId) {
    try {
      console.log('📡 [ReportService] Solicitando detalle del reporte:', reporteId);
      
      const response = await api.get(`/postes/reportes/${reporteId}/`);
      
      console.log('✅ [ReportService] Detalle del reporte:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ [ReportService] Error al obtener detalle:', error);
      console.error('❌ [ReportService] Error response:', error.response?.data);
      throw this.handleError(error);
    }
  }

  /**
   * Validar un reporte (marcarlo como completado)
   * Según tu doc: PATCH /api/postes/reportes/{id}/
   * @param {number} reporteId 
   * @param {Object} data - { observaciones (opcional) }
   * @returns {Promise<Object>}
   */
  async validateReport(reporteId, data = {}) {
    try {
      console.log('📡 [ReportService] Validando reporte:', reporteId, data);
      
      const response = await api.patch(`/postes/reportes/${reporteId}/`, {
        estado: 'completado',
        ...data
      });
      
      console.log('✅ [ReportService] Reporte validado:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ [ReportService] Error al validar reporte:', error);
      console.error('❌ [ReportService] Error response:', error.response?.data);
      throw this.handleError(error);
    }
  }

  /**
   * Observar un reporte (marcarlo como observado con comentario)
   * Según tu doc: PATCH /api/postes/reportes/{id}/
   * @param {number} reporteId 
   * @param {string} comentario - Comentario de observación (obligatorio)
   * @returns {Promise<Object>}
   */
  async rejectReport(reporteId, comentario) {
    try {
      if (!comentario || comentario.trim() === '') {
        throw new Error('El comentario es obligatorio para observar un reporte');
      }

      console.log('📡 [ReportService] Observando reporte:', reporteId, comentario);

      const response = await api.patch(`/postes/reportes/${reporteId}/`, {
        estado: 'observado',
        observaciones: comentario
      });
      
      console.log('✅ [ReportService] Reporte observado:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ [ReportService] Error al observar reporte:', error);
      console.error('❌ [ReportService] Error response:', error.response?.data);
      throw this.handleError(error);
    }
  }

  /**
   * Manejo centralizado de errores
   * @param {Error} error 
   */
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data?.message;

      console.error('❌ [ReportService] Error HTTP:', status, message);

      switch (status) {
        case 400:
          return new Error(message || 'Datos inválidos');
        case 401:
          return new Error('No autorizado. Por favor inicie sesión nuevamente');
        case 403:
          return new Error('No tiene permisos para realizar esta acción');
        case 404:
          return new Error('Endpoint no encontrado. Verifique la URL de la API');
        case 500:
          return new Error('Error del servidor. Intente nuevamente');
        default:
          return new Error(message || 'Error al procesar la solicitud');
      }
    } else if (error.request) {
      // Error de red
      console.error('❌ [ReportService] Error de red:', error.request);
      return new Error('Error de conexión. Verifique su conexión a internet');
    } else {
      // Otro tipo de error
      console.error('❌ [ReportService] Error desconocido:', error.message);
      return new Error(error.message || 'Error inesperado');
    }
  }
}

export default new ReportService();