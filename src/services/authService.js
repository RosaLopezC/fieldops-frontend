import api from '../config/api';

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
    try {
      const response = await api.post('/login/', {
        dni,
        password,
      });

      const { access, refresh, user } = response.data;

      // Guardar tokens y usuario en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        user,
        tokens: { access, refresh },
      };
    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar errores específicos
      if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas');
      } else if (error.response?.status === 400) {
        throw new Error('Datos inválidos. Verifique DNI y contraseña');
      } else if (!error.response) {
        throw new Error('Error de conexión con el servidor');
      } else {
        throw new Error('Error al iniciar sesión. Intente nuevamente');
      }
    }
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
}

// Exportar instancia única (Singleton)
export default new AuthService();