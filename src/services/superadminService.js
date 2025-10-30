// ============== PLANES DISPONIBLES ==============
const mockPlanes = [
  {
    id: 1,
    nombre: 'Plan Básico',
    storage_gb: 10,
    precio_mensual: 150,
    precio_gb_extra: 15,
    descripcion: 'Ideal para empresas pequeñas',
    activo: true
  },
  {
    id: 2,
    nombre: 'Plan Profesional',
    storage_gb: 15,
    precio_mensual: 200,
    precio_gb_extra: 12,
    descripcion: 'Para empresas en crecimiento',
    activo: true
  },
  {
    id: 3,
    nombre: 'Plan Empresarial',
    storage_gb: 20,
    precio_mensual: 250,
    precio_gb_extra: 10,
    descripcion: 'Para grandes operaciones',
    activo: true
  }
];

// Mock data para el Superadmin
const mockEmpresas = [
  {
    id: 1,
    nombre: 'TeleCorp S.A.',
    ruc: '20123456789',
    direccion: 'Av. Principal 123, Lima',
    telefono: '987654321',
    email: 'contacto@telecorp.com',
    admin_local: 'Juan Pérez',
    admin_email: 'juan.perez@telecorp.com',
    usuarios: 28,
    reportes: 1450,
    estado: 'activa',
    fecha_creacion: '2024-01-15',
    // NUEVOS CAMPOS DE PLAN
    plan_id: 1,
    plan_nombre: 'Plan Básico',
    storage_plan_gb: 10,
    storage_usado_gb: 8.5,
    precio_mensual: 150,
    precio_gb_extra: 15,
    fecha_inicio: '2024-01-15',
    fecha_fin: '2025-02-15', // Vence en febrero 2025
    pago_confirmado: true,
    dias_restantes: 16 // Calculado dinámicamente
  },
  {
    id: 2,
    nombre: 'ConectaPeru EIRL',
    ruc: '20987654321',
    direccion: 'Jr. Comercio 456, Callao',
    telefono: '912345678',
    email: 'info@conectaperu.com',
    admin_local: 'María García',
    admin_email: 'maria.garcia@conectaperu.com',
    usuarios: 15,
    reportes: 820,
    estado: 'activa',
    fecha_creacion: '2024-02-01',
    // NUEVOS CAMPOS DE PLAN
    plan_id: 2,
    plan_nombre: 'Plan Profesional',
    storage_plan_gb: 15,
    storage_usado_gb: 16.2, // ⚠️ EXCEDIDO
    precio_mensual: 200,
    precio_gb_extra: 12,
    fecha_inicio: '2024-02-01',
    fecha_fin: '2025-03-01',
    pago_confirmado: false, // ⚠️ NO HA PAGADO EXTRA
    dias_restantes: 30
  },
  {
    id: 3,
    nombre: 'FibraNet S.A.C.',
    ruc: '20555666777',
    direccion: 'Av. Tecnología 789, Arequipa',
    telefono: '998877665',
    email: 'ventas@fibranet.pe',
    admin_local: 'Carlos López',
    admin_email: 'carlos.lopez@fibranet.pe',
    usuarios: 0,
    reportes: 450,
    estado: 'inactiva',
    fecha_creacion: '2024-03-10',
    // NUEVOS CAMPOS DE PLAN
    plan_id: 1,
    plan_nombre: 'Plan Básico',
    storage_plan_gb: 10,
    storage_usado_gb: 12.8, // ⚠️ EXCEDIDO
    precio_mensual: 150,
    precio_gb_extra: 15,
    fecha_inicio: '2024-03-10',
    fecha_fin: '2024-12-10', // ⚠️ YA VENCIÓ
    pago_confirmado: false,
    dias_restantes: -50 // NEGATIVO = VENCIDO
  },
  {
    id: 4,
    nombre: 'RedMax Perú',
    ruc: '20444555666',
    direccion: 'Calle Central 321, Trujillo',
    telefono: '955443322',
    email: 'admin@redmax.pe',
    admin_local: 'Ana Torres',
    admin_email: 'ana.torres@redmax.pe',
    usuarios: 22,
    reportes: 1120,
    estado: 'activa',
    fecha_creacion: '2024-01-20',
    // NUEVOS CAMPOS DE PLAN
    plan_id: 3,
    plan_nombre: 'Plan Empresarial',
    storage_plan_gb: 20,
    storage_usado_gb: 18.3,
    precio_mensual: 250,
    precio_gb_extra: 10,
    fecha_inicio: '2024-01-20',
    fecha_fin: '2025-02-05',
    pago_confirmado: true,
    dias_restantes: 6 // ⚠️ PRONTO A VENCER
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

// Helper para verificar respuesta y manejar errores
const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error('401: No autorizado - Token inválido o expirado');
  }
  
  if (response.status === 403) {
    throw new Error('403: No tienes permisos para esta acción');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }

  return response;
};

const superadminService = {
  // Empresas
  getEmpresas: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockEmpresas }), 500);
    });
  },

  createEmpresa: (empresaData) => {
    return new Promise((resolve) => {
      // Buscar el plan seleccionado
      const plan = mockPlanes.find(p => p.id === parseInt(empresaData.plan_id));
      
      if (!plan) {
        resolve({ error: 'Plan no encontrado' });
        return;
      }

      // Calcular fecha de fin
      const fechaInicio = new Date(empresaData.fecha_inicio);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setMonth(fechaFin.getMonth() + parseInt(empresaData.meses_contrato));

      // Calcular días restantes
      const hoy = new Date();
      const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));

      // Crear nueva empresa
      const newEmpresa = {
        id: mockEmpresas.length + 1,
        nombre: empresaData.nombre,
        ruc: empresaData.ruc,
        direccion: empresaData.direccion,
        telefono: empresaData.telefono,
        email: empresaData.email,
        admin_local: empresaData.admin_local,
        admin_email: empresaData.admin_email,
        usuarios: 0,
        reportes: 0,
        estado: 'activa',
        fecha_creacion: empresaData.fecha_inicio,
        
        // Campos de plan
        plan_id: plan.id,
        plan_nombre: plan.nombre,
        storage_plan_gb: plan.storage_gb,
        storage_usado_gb: 0, // Inicia en 0
        precio_mensual: plan.precio_mensual,
        precio_gb_extra: plan.precio_gb_extra,
        fecha_inicio: empresaData.fecha_inicio,
        fecha_fin: fechaFin.toISOString().split('T')[0],
        pago_confirmado: true, // Asumimos que pagó al crear
        dias_restantes: diasRestantes
      };

      mockEmpresas.push(newEmpresa);
      
      setTimeout(() => resolve({ 
        success: true,
        data: newEmpresa 
      }), 500);
    });
  },

  updateEmpresa: (id, empresaData) => {
    return new Promise((resolve) => {
      const index = mockEmpresas.findIndex(e => e.id === id);
      
      if (index === -1) {
        resolve({ error: 'Empresa no encontrada' });
        return;
      }

      // Si cambió el plan, actualizar datos del plan
      if (empresaData.plan_id) {
        const plan = mockPlanes.find(p => p.id === parseInt(empresaData.plan_id));
        if (plan) {
          empresaData.plan_nombre = plan.nombre;
          empresaData.storage_plan_gb = plan.storage_gb;
          empresaData.precio_mensual = plan.precio_mensual;
          empresaData.precio_gb_extra = plan.precio_gb_extra;
        }
      }

      // Si cambió la duración, recalcular fecha_fin
      if (empresaData.meses_contrato) {
        const fechaInicio = new Date(empresaData.fecha_inicio || mockEmpresas[index].fecha_inicio);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + parseInt(empresaData.meses_contrato));
        empresaData.fecha_fin = fechaFin.toISOString().split('T')[0];
        
        // Recalcular días restantes
        const hoy = new Date();
        empresaData.dias_restantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
      }

      // Actualizar empresa
      mockEmpresas[index] = {
        ...mockEmpresas[index],
        ...empresaData
      };

      setTimeout(() => resolve({ 
        success: true,
        data: mockEmpresas[index] 
      }), 500);
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

  deleteEmpresa: (id) => {
    return new Promise((resolve) => {
      const index = mockEmpresas.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmpresas.splice(index, 1);
      }
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  // Admins locales (usando API real)
  getAdminsLocales: () => {
    return new Promise((resolve) => {
      // Crear lista de admins desde las empresas
      const adminsLocales = mockEmpresas.map(empresa => ({
        id: empresa.id,
        nombre: empresa.admin_local,
        email: empresa.admin_email,
        empresa_id: empresa.id,
        empresa_nombre: empresa.nombre,
        empresa_ruc: empresa.ruc,
        usuarios: empresa.usuarios,
        reportes: empresa.reportes,
        estado: empresa.estado,
        fecha_creacion: empresa.fecha_creacion,
        ultimo_acceso: '2025-01-29 10:30:00' // Mock
      }));
      
      setTimeout(() => resolve({ data: adminsLocales }), 300);
    });
  },

  createAdminLocal: (adminData) => {
    return new Promise((resolve) => {
      // Buscar la empresa
      const empresa = mockEmpresas.find(e => e.id === parseInt(adminData.empresa_id));
      
      if (!empresa) {
        resolve({ error: 'Empresa no encontrada' });
        return;
      }

      // Actualizar admin de la empresa
      empresa.admin_local = adminData.nombre;
      empresa.admin_email = adminData.email;

      const newAdmin = {
        id: empresa.id,
        nombre: adminData.nombre,
        email: adminData.email,
        empresa_id: empresa.id,
        empresa_nombre: empresa.nombre,
        empresa_ruc: empresa.ruc,
        usuarios: empresa.usuarios,
        reportes: empresa.reportes,
        estado: empresa.estado,
        fecha_creacion: new Date().toISOString().split('T')[0],
        ultimo_acceso: null
      };

      setTimeout(() => resolve({ 
        success: true,
        data: newAdmin 
      }), 500);
    });
  },

  updateAdminLocal: (id, adminData) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === id);
      
      if (!empresa) {
        resolve({ error: 'Admin no encontrado' });
        return;
      }

      // Actualizar datos del admin
      empresa.admin_local = adminData.nombre || empresa.admin_local;
      empresa.admin_email = adminData.email || empresa.admin_email;

      const updatedAdmin = {
        id: empresa.id,
        nombre: empresa.admin_local,
        email: empresa.admin_email,
        empresa_id: empresa.id,
        empresa_nombre: empresa.nombre,
        empresa_ruc: empresa.ruc,
        usuarios: empresa.usuarios,
        reportes: empresa.reportes,
        estado: empresa.estado,
        fecha_creacion: empresa.fecha_creacion
      };

      setTimeout(() => resolve({ 
        success: true,
        data: updatedAdmin 
      }), 500);
    });
  },

  deleteAdminLocal: (id) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === id);
      
      if (!empresa) {
        resolve({ error: 'Admin no encontrado' });
        return;
      }

      // Eliminar admin (dejar empresa sin admin)
      empresa.admin_local = 'Sin asignar';
      empresa.admin_email = '';

      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  resetPasswordAdmin: (id) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === id);
      
      if (!empresa) {
        resolve({ error: 'Admin no encontrado' });
        return;
      }

      // Simular reseteo de contraseña
      const newPassword = 'FieldOps' + Math.floor(Math.random() * 10000);

      setTimeout(() => resolve({ 
        success: true,
        message: 'Contraseña reseteada exitosamente',
        new_password: newPassword,
        email: empresa.admin_email
      }), 500);
    });
  },

  // ============== GESTIÓN DE PLANES ==============
  getPlanes: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: mockPlanes }), 300);
    });
  },

  createPlan: (planData) => {
    return new Promise((resolve) => {
      const newPlan = {
        id: mockPlanes.length + 1,
        ...planData,
        activo: true
      };
      mockPlanes.push(newPlan);
      setTimeout(() => resolve({ data: newPlan }), 500);
    });
  },

  updatePlan: (id, planData) => {
    return new Promise((resolve) => {
      const index = mockPlanes.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPlanes[index] = {
          ...mockPlanes[index],
          ...planData
        };
        
        // Notificar a empresas afectadas
        const empresasAfectadas = mockEmpresas.filter(e => e.plan_id === id);
        console.log(`✉️ Notificando a ${empresasAfectadas.length} empresas sobre cambio de plan`);
        
        resolve({ 
          data: mockPlanes[index],
          empresas_notificadas: empresasAfectadas.length 
        });
      } else {
        resolve({ data: null });
      }
    }, 500);
  },

  // ============== VERIFICACIÓN DE ESTADO DE CUENTA ==============
  verificarEstadoCuenta: (empresaId) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === empresaId);
      
      if (!empresa) {
        resolve({ 
          bloqueado: true, 
          mensaje: 'Empresa no encontrada' 
        });
        return;
      }

      const hoy = new Date();
      const fechaFin = new Date(empresa.fecha_fin);
      const diasRestantes = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24));
      
      // 1. VERIFICAR VENCIMIENTO
      if (diasRestantes < 0) {
        resolve({
          bloqueado: true,
          tipo: 'VENCIDO',
          mensaje: `Tu plan venció hace ${Math.abs(diasRestantes)} días. Contacta con FieldOps para renovar.`,
          datos: {
            dias_vencido: Math.abs(diasRestantes),
            fecha_vencimiento: empresa.fecha_fin
          }
        });
        return;
      }
      
      // 2. VERIFICAR ALMACENAMIENTO EXCEDIDO
      const storageExtra = empresa.storage_usado_gb - empresa.storage_plan_gb;
      
      if (storageExtra > 2 && !empresa.pago_confirmado) {
        const costoExtra = storageExtra * empresa.precio_gb_extra;
        resolve({
          bloqueado: true,
          tipo: 'STORAGE_EXCEDIDO',
          mensaje: `Has excedido tu almacenamiento en ${storageExtra.toFixed(1)}GB sin confirmar pago. Costo pendiente: S/. ${costoExtra.toFixed(2)}`,
          datos: {
            storage_extra: storageExtra,
            costo_extra: costoExtra
          }
        });
        return;
      }
      
      // 3. ADVERTENCIAS (NO BLOQUEA)
      const alertas = [];
      
      if (diasRestantes <= 7) {
        alertas.push({
          tipo: 'PROXIMO_VENCER',
          nivel: 'warning',
          mensaje: `⏰ Tu plan vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}. Renueva pronto para evitar interrupciones.`
        });
      }
      
      if (storageExtra > 0) {
        const costoExtra = storageExtra * empresa.precio_gb_extra;
        alertas.push({
          tipo: 'STORAGE_EXTRA',
          nivel: 'info',
          mensaje: `💾 Has usado ${storageExtra.toFixed(1)}GB extra. Costo adicional en próxima factura: S/. ${costoExtra.toFixed(2)}`
        });
      }
      
      resolve({
        bloqueado: false,
        alertas: alertas,
        datos: {
          dias_restantes: diasRestantes,
          storage_usado: empresa.storage_usado_gb,
          storage_plan: empresa.storage_plan_gb,
          storage_extra: Math.max(0, storageExtra)
        }
      });
    }, 300);
  },

  // ============== RENOVAR EMPRESA ==============
  renovarEmpresa: (empresaId, meses = 1) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === empresaId);
      
      if (!empresa) {
        resolve({ success: false, mensaje: 'Empresa no encontrada' });
        return;
      }
      
      // Calcular nueva fecha de fin
      const fechaFinActual = new Date(empresa.fecha_fin);
      const nuevaFechaFin = new Date(fechaFinActual);
      nuevaFechaFin.setMonth(nuevaFechaFin.getMonth() + meses);
      
      empresa.fecha_fin = nuevaFechaFin.toISOString().split('T')[0];
      empresa.pago_confirmado = true;
      empresa.estado = 'activa';
      
      const hoy = new Date();
      empresa.dias_restantes = Math.ceil((nuevaFechaFin - hoy) / (1000 * 60 * 60 * 24));
      
      setTimeout(() => resolve({ 
        success: true, 
        data: empresa,
        mensaje: `Empresa renovada exitosamente hasta ${empresa.fecha_fin}`
      }), 500);
    });
  },

  // ============== CONFIRMAR PAGO EXTRA ==============
  confirmarPagoExtra: (empresaId) => {
    return new Promise((resolve) => {
      const empresa = mockEmpresas.find(e => e.id === empresaId);
      
      if (!empresa) {
        resolve({ success: false, mensaje: 'Empresa no encontrada' });
        return;
      }
      
      empresa.pago_confirmado = true;
      
      setTimeout(() => resolve({ 
        success: true, 
        data: empresa,
        mensaje: 'Pago extra confirmado exitosamente'
      }), 500);
    });
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