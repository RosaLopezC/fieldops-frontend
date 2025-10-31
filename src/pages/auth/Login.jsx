import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { login, getDefaultRoute } = useAuth();

  // Leer el DNI guardado si existe
  const rememberedDni = localStorage.getItem('rememberedDni') || '';

  const [formData, setFormData] = useState({
    dni: rememberedDni,
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(!!rememberedDni);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Si el usuario marca/desmarca recordar, guarda o borra el DNI
  useEffect(() => {
    if (rememberMe && formData.dni) {
      localStorage.setItem('rememberedDni', formData.dni);
    } else if (!rememberMe) {
      localStorage.removeItem('rememberedDni');
    }
  }, [rememberMe, formData.dni]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.dni, formData.password);

      // Guardar o limpiar el DNI según el checkbox
      if (rememberMe) {
        localStorage.setItem('rememberedDni', formData.dni);
      } else {
        localStorage.removeItem('rememberedDni');
      }

      const defaultRoute = getDefaultRoute();
      navigate(defaultRoute, { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page techno-bg">
      <div className="login-card techno-card">
        <div className="login-header">
          <img 
            src="/src/assets/images/logo.png" 
            alt="FieldOps Logo" 
            className="login-logo"
          />
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">Accede a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <div className="input-group">
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
              autoComplete="username"
            />
          </div>

          <div className="input-group password-group">
            <Input
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={handleChange}
              icon={<FaLock />}
              required
              fullWidth
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="login-options">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Recordar datos</span>
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
          <p className="login-version">v1.0.0 &copy; FieldOps</p>
        </div>
      </div>
    </div>
  );
};

export default Login;