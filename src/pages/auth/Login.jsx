import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FaUser, FaLock } from 'react-icons/fa';
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { login, getDefaultRoute } = useAuth();

  const [formData, setFormData] = useState({
    dni: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.dni, formData.password);
      
      // ⭐ AGREGAR LOGS AQUÍ
      console.log('🔍 Login Response Complete:', response);
      console.log('👤 User Data:', response?.user);
      console.log('🎭 User Role:', response?.user?.rol);
      console.log('🏢 User Company:', response?.user?.empresa);
      console.log('📧 User Email:', response?.user?.email);
      
      // Redirigir a la ruta por defecto según el rol
      const defaultRoute = getDefaultRoute();
      console.log('🚀 Redirecting to:', defaultRoute);
      
      navigate(defaultRoute, { replace: true });
    } catch (err) {
      console.error('❌ Login Error:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img 
            src="/src/assets/images/logo.png" 
            alt="FieldOps Logo" 
            className="login-logo"
          />
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <Input
            label="DNI"
            name="dni"
            type="text"
            placeholder="Ingrese su DNI"
            value={formData.dni}
            onChange={handleChange}
            icon={<FaUser />}
            required
            fullWidth
            disabled={loading}
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Ingrese su contraseña"
            value={formData.password}
            onChange={handleChange}
            icon={<FaLock />}
            required
            fullWidth
            disabled={loading}
          />

          <div className="login-options">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Recordar contraseña</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Ingresar
          </Button>
        </form>

        <div className="login-footer">
          <p className="login-version">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;