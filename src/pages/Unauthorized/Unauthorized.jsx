import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import './Unauthorized.scss';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <FaExclamationTriangle />
        </div>
        
        <h1>Acceso Denegado</h1>
        
        <p className="unauthorized-message">
          No tienes permisos para acceder a esta página.
        </p>
        
        <p className="unauthorized-submessage">
          Si crees que esto es un error, contacta con el administrador del sistema.
        </p>

        <div className="unauthorized-actions">
          <Button
            variant="outline"
            onClick={handleGoBack}
            leftIcon={<FaArrowLeft />}
          >
            Volver
          </Button>
          
          <Button
            variant="primary"
            onClick={handleGoHome}
            leftIcon={<FaHome />}
          >
            Ir al Inicio
          </Button>
        </div>

        <div className="unauthorized-code">
          Error 403 - Forbidden
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;