import api from '../config/api';
import superadminService from './superadminService';

/**
 * Servicio de autenticación
 * Basado en tu API: POST /api/login/
 */
class AuthService {
  /**
   * Login de usuario
   * @param {string} dni - DNI del usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Datos del usuario y tokens
   */
  async login(dni, password) {
    console.log('🔄 Usando loginMock para desarrollo...');
    return this.loginMock({ dni, password });
  }

  /**
   * Login mock para pruebas locales
   * @param {Object} credentials
   * @returns {Promise}
   */
  loginMock(credentials) {
    return new Promise((resolve) => {
      const { dni, password } = credentials;
      let user = null;
  
      // ============== SUPERADMIN ==============
      if (dni === '99999991' && password === 'admin123') { // ✅ Cambiado
        user = {
          id: 1,
          nombre: 'Superadmin',
          nombres: 'Super',
          apellidos: 'Admin',
          email: 'admin@fieldops.com',
          dni: '99999991',
          rol: 'superadmin'
        };
      }
      
      // ============== ADMIN LOCAL - EMPRESA ACTIVA ==============
      else if (dni === '12345678' && password === 'admin123') { // ✅ Cambiado
        user = {
          id: 2,
          nombre: 'Rosa Elena López',
          nombres: 'Rosa Elena',
          apellidos: 'López Clemente',
          email: 'rosa.lopez@telecorp.com',
          dni: '12345678',
          rol: 'admin',
          empresa_id: 1,
          empresa_nombre: 'TeleCorp S.A.'
        };
      }
      
      // ============== ADMIN LOCAL - PRÓXIMA A VENCER ==============
      else if (dni === '87654321' && password === 'admin123') { // ✅ Cambiado
        user = {
          id: 3,
          nombre: 'María García',
          nombres: 'María',
          apellidos: 'García Rodríguez',
          email: 'maria.garcia@conectaperu.com',
          dni: '87654321',
          rol: 'admin',
          empresa_id: 2,
          empresa_nombre: 'ConectaPeru EIRL'
        };
      }
      
      // ============== ADMIN LOCAL - VENCIDA ==============
      else if (dni === '11223344' && password === 'admin123') { // ✅ Cambiado
        user = {
          id: 4,
          nombre: 'Carlos López',
          nombres: 'Carlos',
          apellidos: 'López Sánchez',
          email: 'carlos.lopez@fibranet.pe',
          dni: '11223344',
          rol: 'admin',
          empresa_id: 3,
          empresa_nombre: 'FibraNet S.A.C.'
        };
      }
      
      // ============== SUPERVISOR ==============
      else if (dni === '99999993' && password === 'super123') { // ✅ Cambiado
        user = {
          id: 5,
          nombre: 'Supervisor Test',
          nombres: 'Supervisor',
          apellidos: 'Test',
          email: 'supervisor@telecorp.com',
          dni: '99999993',
          rol: 'supervisor',
          empresa_id: 1
        };
      }
      
      // ============== ENCARGADO ==============
      else if (dni === '99999994' && password === 'enc123') { // ✅ Cambiado
        user = {
          id: 6,
          nombre: 'Encargado Test',
          nombres: 'Encargado',
          apellidos: 'Test',
          email: 'encargado@telecorp.com',
          dni: '99999994',
          rol: 'encargado',
          empresa_id: 1
        };
      }
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', 'mock-token-' + Date.now());
        setTimeout(() => resolve({ success: true, user }), 500);
      } else {
        setTimeout(() => resolve({ success: false, message: 'DNI o contraseña incorrectos' }), 500);
      }
    });
  }

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Obtener usuario actual del localStorage
   * @returns {Object|null} Usuario o null si no está autenticado
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Obtener el token de acceso
   * @returns {string|null}
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Refrescar el token de acceso (opcional, para implementar después)
   * @returns {Promise}
   */
  async refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh_token');
      
      if (!refresh) {
        throw new Error('No hay refresh token');
      }

      const response = await api.post('/token/refresh/', {
        refresh,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);

      return access;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      this.logout();
      throw error;
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean}
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   * @param {Array<string>} roles - Array de roles permitidos
   * @returns {boolean}
   */
  hasAnyRole(roles) {
    const user = this.getCurrentUser();
    return roles.includes(user?.rol);
  }

  /**
   * ============== VERIFICACIÓN DE ESTADO DE CUENTA ==============
   */
  async verificarEstadoCuentaAdmin() {
    try {
      const userStr = localStorage.getItem('user');
      console.log('📦 User from localStorage:', userStr);
      
      const user = JSON.parse(userStr);
      console.log('👤 Parsed user:', user);
      
      // Solo verificar para admins
      if (!user || user.rol !== 'admin') {
        console.log('ℹ️ No es admin, retornando bloqueado=false');
        return { bloqueado: false };
      }

      const empresaId = user.empresa_id;
      console.log('🏢 Empresa ID del usuario:', empresaId);
      
      if (!empresaId) {
        console.warn('⚠️ Admin sin empresa_id asignada');
        return { bloqueado: false };
      }
      
      // Llamar a la función de verificación
      console.log('🔍 Llamando a superadminService.verificarEstadoCuenta...');
      const verificacion = await superadminService.verificarEstadoCuenta(empresaId);
      
      console.log('✅ Verificación completa:', verificacion);
      
      return verificacion;
      
    } catch (error) {
      console.error('❌ Error al verificar estado de cuenta:', error);
      return { bloqueado: false };
    }
  }
}

// Exportar instancia única (Singleton)
export default new AuthService();