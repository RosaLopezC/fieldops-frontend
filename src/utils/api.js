const API_URL = 'http://31.97.91.123:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

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

  // Si es 204 No Content, no hay body
  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
};

export const api = {
  // ============== SUPERVISORES ==============
  
  getSupervisors: async () => {
    const response = await fetch(`${API_URL}/usuarios/supervisores/`, {  // ← PLURAL
      method: 'GET',
      headers: getAuthHeader()
    });
    const data = await handleResponse(response);
    
    // Transformar al formato del frontend
    const transformed = data.map(supervisor => ({
      id: supervisor.id,
      dni: supervisor.dni,
      nombres: supervisor.nombres,
      apellidos: supervisor.apellidos,
      email: supervisor.email,
      celular: supervisor.telefono || '',
      estado: supervisor.estado
    }));
    
    return { data: transformed };
  },

  createSupervisor: async (supervisorData) => {
    const payload = {
      dni: supervisorData.dni,
      nombres: supervisorData.nombres,  // ← Usar nombres directamente
      apellidos: supervisorData.apellidos,  // ← Usar apellidos directamente
      email: supervisorData.email,
      password: supervisorData.password
    };

    // Solo agregar telefono si existe
    if (supervisorData.celular) {
      payload.telefono = supervisorData.celular;
    }

    const response = await fetch(`${API_URL}/usuarios/supervisor/`, {  // ← SINGULAR
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    
    return handleResponse(response);
  },

  updateSupervisor: async (id, supervisorData) => {
    // Nota: Tu documentación NO menciona endpoint de actualizar
    // Si existe, debería ser PUT /api/usuarios/supervisor/{id}/
    const payload = {};
    
    if (supervisorData.dni) payload.dni = supervisorData.dni;
    if (supervisorData.nombres) payload.nombres = supervisorData.nombres;
    if (supervisorData.apellidos) payload.apellidos = supervisorData.apellidos;
    if (supervisorData.email) payload.email = supervisorData.email;
    if (supervisorData.celular) payload.telefono = supervisorData.celular;
    if (supervisorData.password) payload.password = supervisorData.password;

    const response = await fetch(`${API_URL}/usuarios/supervisor/${id}/`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    
    return handleResponse(response);
  },

  deleteSupervisor: async (id) => {
    // Nota: Tu documentación NO menciona endpoint de eliminar
    // Asumiendo que existe como /api/usuarios/supervisor/{id}/
    const response = await fetch(`${API_URL}/usuarios/supervisor/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    return handleResponse(response);
  },

  // ============== ENCARGADOS ==============
  
  getEncargados: async () => {
    const response = await fetch(`${API_URL}/usuarios/encargados/`, {  // ← PLURAL
      method: 'GET',
      headers: getAuthHeader()
    });
    const data = await handleResponse(response);
    
    // Transformar al formato del frontend
    const transformed = data.map(encargado => ({
      id: encargado.id,
      dni: encargado.dni,
      nombres: encargado.nombres,
      apellidos: encargado.apellidos,
      email: encargado.email,
      celular: encargado.telefono || '',
      supervisor: encargado.supervisor,
      estado: encargado.estado
    }));
    
    return { data: transformed };
  },

  createEncargado: async (encargadoData) => {
    const payload = {
      dni: encargadoData.dni,
      nombres: encargadoData.nombres,  // ← Usar nombres directamente
      apellidos: encargadoData.apellidos,  // ← Usar apellidos directamente
      email: encargadoData.email,
      password: encargadoData.password,
      supervisor: parseInt(encargadoData.supervisor)  // ← OBLIGATORIO
    };

    // Solo agregar telefono si existe
    if (encargadoData.celular) {
      payload.telefono = encargadoData.celular;
    }

    const response = await fetch(`${API_URL}/usuarios/encargado/`, {  // ← SINGULAR
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    
    return handleResponse(response);
  },

  updateEncargado: async (id, encargadoData) => {
    // Nota: Tu documentación NO menciona endpoint de actualizar
    // Si existe, debería ser PUT /api/usuarios/encargado/{id}/
    const payload = {};
    
    if (encargadoData.dni) payload.dni = encargadoData.dni;
    if (encargadoData.nombres) payload.nombres = encargadoData.nombres;
    if (encargadoData.apellidos) payload.apellidos = encargadoData.apellidos;
    if (encargadoData.email) payload.email = encargadoData.email;
    if (encargadoData.celular) payload.telefono = encargadoData.celular;
    if (encargadoData.password) payload.password = encargadoData.password;
    if (encargadoData.supervisor) payload.supervisor = parseInt(encargadoData.supervisor);

    const response = await fetch(`${API_URL}/usuarios/encargado/${id}/`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    
    return handleResponse(response);
  },

  deleteEncargado: async (id) => {
    // Nota: Tu documentación NO menciona endpoint de eliminar
    // Asumiendo que existe como /api/usuarios/encargado/{id}/
    const response = await fetch(`${API_URL}/usuarios/encargado/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    return handleResponse(response);
  }
};