import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { ROLE_DEFAULT_ROUTES } from '../config/roles';

// Crear el contexto
export const AuthContext = createContext(null);

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getAccessToken();

        if (currentUser && token) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login de usuario
   * @param {string} dni 
   * @param {string} password 
   * @returns {Promise}
   */
  const login = useCallback(async (dni, password) => {
    try {
      setLoading(true);
      const response = await authService.login(dni, password);
      
      setUser(response.user);
      setIsAuthenticated(true);

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout de usuario
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Obtener ruta por defecto según el rol del usuario
   */
  const getDefaultRoute = useCallback(() => {
    if (!user) return '/login';
    return ROLE_DEFAULT_ROUTES[user.rol] || '/';
  }, [user]);

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role 
   */
  const hasRole = useCallback((role) => {
    return user?.rol === role;
  }, [user]);

  /**
   * Verificar si el usuario tiene alguno de los roles permitidos
   * @param {Array<string>} roles 
   */
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.rol);
  }, [user]);

  /**
   * Actualizar datos del usuario (útil después de editar perfil)
   * @param {Object} updatedUser 
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  // Valor del contexto
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getDefaultRoute,
    hasRole,
    hasAnyRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};