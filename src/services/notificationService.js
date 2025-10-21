// Mock data para notificaciones
const mockNotifications = {
  supervisor: [
    {
      id: 1,
      tipo: 'nuevo_reporte',
      titulo: 'Nuevo reporte creado',
      mensaje: 'Omar Urteaga creó el reporte #298523 en LOS OLIVOS',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // hace 2 horas
      leido: false,
      icono: 'FaFileAlt',
      color: 'info',
      url: '/supervisor/reportes?id=298523'
    },
    {
      id: 2,
      tipo: 'reporte_editado',
      titulo: 'Reporte editado',
      mensaje: 'Daphne Medina editó el reporte #984231',
      fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // hace 5 horas
      leido: false,
      icono: 'FaEdit',
      color: 'warning',
      url: '/supervisor/reportes?id=984231'
    },
    {
      id: 3,
      tipo: 'recordatorio',
      titulo: 'Reportes pendientes',
      mensaje: 'Tienes 5 reportes pendientes de validar',
      fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // hace 1 día
      leido: true,
      icono: 'FaClock',
      color: 'secondary',
      url: '/supervisor/reportes'
    }
  ],
  encargado: [
    {
      id: 1,
      tipo: 'reporte_aprobado',
      titulo: 'Reporte aprobado',
      mensaje: 'Tu reporte #298523 fue aprobado por el supervisor',
      fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // hace 1 hora
      leido: false,
      icono: 'FaCheckCircle',
      color: 'success',
      url: '/encargado/reportes?id=298523'
    },
    {
      id: 2,
      tipo: 'reporte_observado',
      titulo: 'Reporte observado',
      mensaje: 'Tu reporte #984231 tiene observaciones. Revísalo y corrígelo.',
      fecha: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // hace 3 horas
      leido: false,
      icono: 'FaExclamationTriangle',
      color: 'danger',
      url: '/encargado/reportes?id=984231'
    },
    {
      id: 3,
      tipo: 'zona_asignada',
      titulo: 'Nueva zona asignada',
      mensaje: 'Se te asignó la zona Z10 - Sector Z10S11',
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // hace 2 días
      leido: true,
      icono: 'FaMapMarkedAlt',
      color: 'info',
      url: '/encargado/zonas'
    }
  ]
};

// Función para obtener tiempo relativo
const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
};

const notificationService = {
  // Obtener notificaciones por rol
  getNotifications: (role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = mockNotifications[role] || [];
        const notificationsWithTime = notifications.map(notif => ({
          ...notif,
          timeAgo: getTimeAgo(notif.fecha)
        }));
        resolve({ data: notificationsWithTime });
      }, 300);
    });
  },

  // Marcar como leída
  markAsRead: (notificationId, role) => {
    return new Promise((resolve) => {
      const notifications = mockNotifications[role];
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.leido = true;
      }
      setTimeout(() => resolve({ success: true }), 200);
    });
  },

  // Marcar todas como leídas
  markAllAsRead: (role) => {
    return new Promise((resolve) => {
      const notifications = mockNotifications[role];
      notifications.forEach(n => n.leido = true);
      setTimeout(() => resolve({ success: true }), 200);
    });
  },

  // Obtener contador de no leídas
  getUnreadCount: (role) => {
    return new Promise((resolve) => {
      const notifications = mockNotifications[role] || [];
      const count = notifications.filter(n => !n.leido).length;
      setTimeout(() => resolve({ data: count }), 200);
    });
  }
};

export default notificationService;