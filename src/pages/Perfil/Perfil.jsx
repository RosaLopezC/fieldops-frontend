import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FaUser, FaEnvelope, FaBuilding, FaIdCard, FaArrowLeft } from 'react-icons/fa';
import './Perfil.scss';

const Perfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const getRoleName = (rol) => {
    const roles = {
      'superadmin': 'Superadministrador',
      'admin': 'Administrador Local',
      'supervisor': 'Supervisor',
      'encargado': 'Encargado'
    };
    return roles[rol] || rol;
  };

  return (
    <div className="perfil-page">
      <div className="perfil-header">
        <Button
          variant="outline"
          size="small"
          onClick={handleGoBack}
          leftIcon={<FaArrowLeft />}
        >
          Volver
        </Button>
        <h1>Mi Perfil</h1>
      </div>

      <div className="perfil-content">
        <Card className="perfil-card">
          <div className="perfil-avatar-section">
            <div className="perfil-avatar">
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2>{user?.nombre || 'Usuario'}</h2>
            <p className="perfil-role">{getRoleName(user?.rol)}</p>
          </div>

          <div className="perfil-info">
            <div className="info-item">
              <div className="info-icon">
                <FaUser />
              </div>
              <div className="info-content">
                <span className="info-label">Nombre completo</span>
                <span className="info-value">
                  {user?.nombres} {user?.apellidos}
                </span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaIdCard />
              </div>
              <div className="info-content">
                <span className="info-label">DNI</span>
                <span className="info-value">{user?.dni || 'No disponible'}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div className="info-content">
                <span className="info-label">Correo electrónico</span>
                <span className="info-value">{user?.email || 'No disponible'}</span>
              </div>
            </div>

            {user?.empresa_nombre && (
              <div className="info-item">
                <div className="info-icon">
                  <FaBuilding />
                </div>
                <div className="info-content">
                  <span className="info-label">Empresa</span>
                  <span className="info-value">{user.empresa_nombre}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="perfil-actions">
          <h3>Opciones</h3>
          <Button variant="outline" fullWidth disabled>
            Cambiar Contraseña
          </Button>
          <p className="perfil-note">
            Para cambiar tu contraseña, contacta con el administrador del sistema.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;