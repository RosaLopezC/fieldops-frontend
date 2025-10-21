// Roles del sistema (basados en tu documentación)
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  ADMIN_LOCAL: 'admin_local', // ← Variante del backend
  SUPERVISOR: 'supervisor',
  ENCARGADO: 'encargado',
};

// Nombres legibles de los roles
export const ROLE_NAMES = {
  [ROLES.SUPERADMIN]: 'Superadministrador',
  [ROLES.ADMIN]: 'Administrador Local',
  [ROLES.ADMIN_LOCAL]: 'Administrador Local', // ← Mismo nombre
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.ENCARGADO]: 'Encargado',
};

// Rutas por defecto según rol (después de login)
export const ROLE_DEFAULT_ROUTES = {
  [ROLES.SUPERADMIN]: '/superadmin/dashboard', // ← Verificar
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.ADMIN_LOCAL]: '/admin/dashboard',
  [ROLES.SUPERVISOR]: '/supervisor/dashboard',
  [ROLES.ENCARGADO]: '/encargado',
};

// Colores de identificación por rol
export const ROLE_COLORS = {
  [ROLES.SUPERADMIN]: '#9b59b6',
  [ROLES.ADMIN]: '#005B9A',
  [ROLES.ADMIN_LOCAL]: '#005B9A', // ← Mismo color
  [ROLES.SUPERVISOR]: '#FF6B35',
  [ROLES.ENCARGADO]: '#28a745',
};

/**
 * Verificar si un rol es de tipo administrador
 * @param {string} role 
 * @returns {boolean}
 */
export const isAdminRole = (role) => {
  return role === ROLES.ADMIN || role === ROLES.ADMIN_LOCAL;
};