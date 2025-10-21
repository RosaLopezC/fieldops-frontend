// Mock data para el Superadmin
const mockEmpresas = [
  {
    id: 1,
    nombre: 'TeleCorp S.A.',
    ruc: '20123456789',
    direccion: 'Av. Principal 123, Lima',
    telefono: '987654321',
    email: 'contacto@telecorp.com',
    estado: 'activa',
    admin_local: 'Juan Pérez',
    usuarios_activos: 28,
    reportes_totales: 1450,
    fecha_registro: '2024-01-15'
  },
  {
    id: 2,
    nombre: 'ConectaPeru EIRL',
    ruc: '20987654321',
    direccion: 'Jr. Comercio 456, Callao',
    telefono: '912345678',
    email: 'info@conectaperu.com',
    estado: 'activa',
    admin_local: 'María García',
    usuarios_activos: 15,
    reportes_totales: 820,
    fecha_registro: '2024-02-20'
  },
  {
    id: 3,
    nombre: 'FibraNet S.A.C.',
    ruc: '20555666777',
    direccion: 'Av. Tecnología 789, Arequipa',
    telefono: '998877665',
    email: 'ventas@fibranet.pe',
    estado: 'inactiva',
    admin_local: 'Carlos López',
    usuarios_activos: 0,
    reportes_totales: 450,
    fecha_registro: '2023-11-10'
  },
  {
    id: 4,
    nombre: 'RedMax Perú',
    ruc: '20444555666',
    direccion: 'Calle Central 321, Trujillo',
    telefono: '955443322',
    email: 'admin@redmax.pe',
    estado: 'activa',
    admin_local: 'Ana Torres',
    usuarios_activos: 22,
    reportes_totales: 1120,
    fecha_registro: '2024-03-05'
  }
];

const mockAdminsLocales = [
  {
    id: 1,
    dni: '12345678',
    nombres: 'Juan',
    apellidos: 'Pérez González',
    email: 'juan.perez@telecorp.com',
    empresa_id: 1,
    empresa_nombre: 'TeleCorp S.A.',
    celular: '987654321',
    estado: 'activo',
    fecha_creacion: '2024-01-15'
  },
  {
    id: 2,
    dni: '87654321',
    nombres: 'María',
    apellidos: 'García Rojas',
    email: 'maria.garcia@conectaperu.com',
    empresa_id: 2,
    empresa_nombre: 'ConectaPeru EIRL',
    celular: '912345678',
    estado: 'activo',
    fecha_creacion: '2024-02-20'
  },
  {
    id: 3,
    dni: '55566677',
    nombres: 'Carlos',
    apellidos: 'López Mendoza',
    email: 'carlos.lopez@fibranet.pe',
    empresa_id: 3,
    empresa_nombre: 'FibraNet S.A.C.',
    celular: '998877665',
    estado: 'inactivo',
    fecha_creacion: '2023-11-10'
  }
];

const mockLogs = [
  {
    id: 1,
    fecha: '2025-01-20 14:32:15',
    usuario: 'admin@fieldops.com',
    accion: 'Creó empresa',
    detalle: 'TeleCorp S.A. (RUC: 20123456789)',
    tipo: 'creacion'
  },
  {
    id: 2,
    fecha: '2025-01-20 14:15:22',
    usuario: 'admin@fieldops.com',
    accion: 'Activó empresa',
    detalle: 'RedMax Perú',
    tipo: 'modificacion'
  },
  {
    id: 3,
    fecha: '2025-01-20 13:45:10',
    usuario: 'admin@fieldops.com',
    accion: 'Desactivó empresa',
    detalle: 'FibraNet S.A.C.',
    tipo: 'modificacion'
  },
  {
    id: 4,
    fecha: '2025-01-20 12:20:33',
    usuario: 'admin@fieldops.com',
    accion: 'Creó admin local',
    detalle: 'Ana Torres para RedMax Perú',
    tipo: 'creacion'
  },
  {
    id: 5,
    fecha: '2025-01-20 11:55:18',
    usuario: 'admin@fieldops.com',
    accion: 'Reseteo contraseña',
    detalle: 'Usuario: juan.perez@telecorp.com',
    tipo: 'seguridad'
  }
];

const superadminService = {
  // Empresas
  getEmpresas: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockEmpresas }), 500);
    });
  },

  createEmpresa: (empresaData) => {
    return new Promise((resolve) => {
      const newEmpresa = {
        id: mockEmpresas.length + 1,
        ...empresaData,
        usuarios_activos: 0,
        reportes_totales: 0,
        fecha_registro: new Date().toISOString().split('T')[0]
      };
      mockEmpresas.push(newEmpresa);
      setTimeout(() => resolve({ data: newEmpresa }), 500);
    });
  },

  updateEmpresa: (id, empresaData) => {
    return new Promise((resolve) => {
      const index = mockEmpresas.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmpresas[index] = { ...mockEmpresas[index], ...empresaData };
        setTimeout(() => resolve({ data: mockEmpresas[index] }), 500);
      }
    });
  },

  toggleEmpresaEstado: (id) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === id);
      if (empresa) {
        empresa.estado = empresa.estado === 'activa' ? 'inactiva' : 'activa';
        setTimeout(() => resolve({ data: empresa }), 500);
      }
    });
  },

  // Admins locales (usando API real)
  getAdminsLocales: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://31.97.91.123/api/usuarios/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      
      // Filtrar solo usuarios con rol admin o admin_local
      const admins = data.filter(user => 
        user.rol === 'ADMIN' || user.rol === 'ADMIN_LOCAL'
      );

      // Transformar al formato esperado por el frontend
      const transformedAdmins = admins.map(admin => ({
        id: admin.id,
        dni: admin.dni,
        nombres: admin.first_name || admin.nombres,
        apellidos: admin.last_name || admin.apellidos,
        email: admin.email,
        celular: admin.telefono || admin.celular,
        empresa_id: admin.empresa,
        empresa_nombre: admin.empresa_nombre || 'Sin asignar',
        estado: admin.is_active ? 'activo' : 'inactivo',
        fecha_creacion: admin.date_joined || admin.created_at
      }));

      return { data: transformedAdmins };
    } catch (error) {
      console.error('Error en getAdminsLocales:', error);
      throw error;
    }
  },

  createAdminLocal: async (adminData) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Transformar datos al formato de la API
      const payload = {
        dni: adminData.dni,
        first_name: adminData.nombres,
        last_name: adminData.apellidos,
        email: adminData.email,
        password: adminData.password,
        telefono: adminData.celular,
        rol: 'ADMIN_LOCAL',
        empresa: parseInt(adminData.empresa_id),
        is_active: true
      };

      const response = await fetch('http://31.97.91.123/api/usuarios/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear admin local');
      }

      const data = await response.json();
      
      // Transformar respuesta
      const transformedAdmin = {
        id: data.id,
        dni: data.dni,
        nombres: data.first_name,
        apellidos: data.last_name,
        email: data.email,
        celular: data.telefono,
        empresa_id: data.empresa,
        empresa_nombre: adminData.empresa_nombre,
        estado: data.is_active ? 'activo' : 'inactivo',
        fecha_creacion: data.date_joined || new Date().toISOString()
      };

      return { data: transformedAdmin };
    } catch (error) {
      console.error('Error en createAdminLocal:', error);
      throw error;
    }
  },

  updateAdminLocal: async (adminId, adminData) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Preparar payload (solo campos que se envían)
      const payload = {};
      
      if (adminData.dni) payload.dni = adminData.dni;
      if (adminData.nombres) payload.first_name = adminData.nombres;
      if (adminData.apellidos) payload.last_name = adminData.apellidos;
      if (adminData.email) payload.email = adminData.email;
      if (adminData.celular) payload.telefono = adminData.celular;
      if (adminData.password) payload.password = adminData.password;
      if (adminData.empresa_id) payload.empresa = parseInt(adminData.empresa_id);

      const response = await fetch(`http://31.97.91.123/api/usuarios/editar/${adminId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar admin local');
      }

      const data = await response.json();
      
      // Transformar respuesta
      const transformedAdmin = {
        id: data.id,
        dni: data.dni,
        nombres: data.first_name,
        apellidos: data.last_name,
        email: data.email,
        celular: data.telefono,
        empresa_id: data.empresa,
        empresa_nombre: adminData.empresa_nombre,
        estado: data.is_active ? 'activo' : 'inactivo'
      };

      return { data: transformedAdmin };
    } catch (error) {
      console.error('Error en updateAdminLocal:', error);
      throw error;
    }
  },

  deleteAdminLocal: async (adminId) => {
    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`http://31.97.91.123/api/usuarios/eliminar/${adminId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar admin local');
      }

      return { success: true };
    } catch (error) {
      console.error('Error en deleteAdminLocal:', error);
      throw error;
    }
  },

  // Logs
  getLogs: (filters = {}) => {
    return new Promise((resolve) => {
      let filteredLogs = [...mockLogs];
      
      if (filters.tipo && filters.tipo !== 'todos') {
        filteredLogs = filteredLogs.filter(log => log.tipo === filters.tipo);
      }
      
      setTimeout(() => resolve({ data: filteredLogs }), 500);
    });
  },

  // Estadísticas globales
  getGlobalStats: () => {
    return new Promise((resolve) => {
      const stats = {
        total_empresas: mockEmpresas.length,
        empresas_activas: mockEmpresas.filter(e => e.estado === 'activa').length,
        total_usuarios: mockEmpresas.reduce((sum, e) => sum + e.usuarios_activos, 0),
        total_reportes: mockEmpresas.reduce((sum, e) => sum + e.reportes_totales, 0),
        admins_activos: mockAdminsLocales.filter(a => a.estado === 'activo').length
      };
      setTimeout(() => resolve({ data: stats }), 500);
    });
  }
};

export default superadminService;