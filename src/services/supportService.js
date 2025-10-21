// Mock data para tickets de soporte
const mockTickets = [
  {
    id: 1,
    fecha: '2025-01-18 14:30:00',
    categoria: 'tecnico',
    asunto: 'Error al exportar reportes',
    descripcion: 'No puedo exportar los reportes a Excel, el botón no responde.',
    estado: 'resuelto',
    prioridad: 'media',
    respuesta: 'El problema fue solucionado en la última actualización del sistema.'
  },
  {
    id: 2,
    fecha: '2025-01-19 09:15:00',
    categoria: 'usuario',
    asunto: 'No puedo crear nuevo encargado',
    descripcion: 'Al intentar crear un encargado me sale error de permisos.',
    estado: 'en_proceso',
    prioridad: 'alta',
    respuesta: null
  },
  {
    id: 3,
    fecha: '2025-01-20 11:45:00',
    categoria: 'reporte',
    asunto: 'Reporte con ubicación incorrecta',
    descripcion: 'El reporte ID 298523 muestra coordenadas GPS incorrectas.',
    estado: 'pendiente',
    prioridad: 'baja',
    respuesta: null
  }
];

const supportService = {
  // Obtener todos los tickets del usuario
  getTickets: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockTickets }), 500);
    });
  },

  // Crear nuevo ticket
  createTicket: (ticketData) => {
    return new Promise((resolve) => {
      const newTicket = {
        id: mockTickets.length + 1,
        fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ...ticketData,
        estado: 'pendiente',
        respuesta: null
      };
      mockTickets.unshift(newTicket);
      setTimeout(() => resolve({ data: newTicket }), 500);
    });
  }
};

export default supportService;