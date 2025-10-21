import React, { useState, useEffect } from 'react';
import supportService from '../../services/supportService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { 
  FaPlus, 
  FaHeadset,
  FaCheckCircle,
  FaClock,
  FaSpinner
} from 'react-icons/fa';
import './Support.scss';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    categoria: '',
    asunto: '',
    descripcion: '',
    prioridad: 'media'
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      categoria: '',
      asunto: '',
      descripcion: '',
      prioridad: 'media'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await supportService.createTicket(formData);
      handleCloseModal();
      loadTickets();
    } catch (error) {
      console.error('Error al crear ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'resuelto':
        return 'success';
      case 'en_proceso':
        return 'info';
      case 'pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'resuelto':
        return <FaCheckCircle />;
      case 'en_proceso':
        return <FaSpinner />;
      case 'pendiente':
        return <FaClock />;
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'resuelto':
        return 'Resuelto';
      case 'en_proceso':
        return 'En Proceso';
      case 'pendiente':
        return 'Pendiente';
      default:
        return estado;
    }
  };

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'danger';
      case 'media':
        return 'warning';
      case 'baja':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getCategoriaLabel = (categoria) => {
    switch (categoria) {
      case 'tecnico':
        return 'Técnico';
      case 'usuario':
        return 'Usuario';
      case 'reporte':
        return 'Reporte';
      case 'otro':
        return 'Otro';
      default:
        return categoria;
    }
  };

  return (
    <div className="support-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <FaHeadset className="header-icon" />
          <div>
            <h1>Centro de Soporte</h1>
            <p>Envía tus consultas y reporta problemas técnicos</p>
          </div>
        </div>
        <Button
          variant="primary"
          icon={<FaPlus />}
          onClick={handleOpenModal}
        >
          Nuevo Ticket
        </Button>
      </div>

      {/* Lista de tickets */}
      <div className="tickets-grid">
        {loading && tickets.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando tickets...</p>
            </div>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <div className="empty-state">
              <FaHeadset className="empty-icon" />
              <h3>No tienes tickets de soporte</h3>
              <p>Crea tu primer ticket para obtener ayuda</p>
              <Button
                variant="primary"
                icon={<FaPlus />}
                onClick={handleOpenModal}
              >
                Crear Ticket
              </Button>
            </div>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-info">
                  <span className="ticket-id">Ticket #{ticket.id}</span>
                  <span className="ticket-fecha">{ticket.fecha}</span>
                </div>
                <div className="ticket-badges">
                  <Badge variant={getPrioridadBadge(ticket.prioridad)}>
                    {ticket.prioridad.toUpperCase()}
                  </Badge>
                  <Badge variant={getEstadoBadge(ticket.estado)}>
                    {getEstadoIcon(ticket.estado)} {getEstadoLabel(ticket.estado)}
                  </Badge>
                </div>
              </div>

              <div className="ticket-body">
                <div className="ticket-categoria">
                  <strong>Categoría:</strong> {getCategoriaLabel(ticket.categoria)}
                </div>
                <h3 className="ticket-asunto">{ticket.asunto}</h3>
                <p className="ticket-descripcion">{ticket.descripcion}</p>

                {ticket.respuesta && (
                  <div className="ticket-respuesta">
                    <strong>Respuesta del equipo:</strong>
                    <p>{ticket.respuesta}</p>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal para crear ticket */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Nuevo Ticket de Soporte"
      >
        <form onSubmit={handleSubmit} className="support-form">
          <div className="form-row">
            <label className="input-label">Categoría</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              required
              className="select-input"
            >
              <option value="">Seleccione una categoría</option>
              <option value="tecnico">Problema Técnico</option>
              <option value="usuario">Gestión de Usuarios</option>
              <option value="reporte">Problema con Reportes</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-row">
            <label className="input-label">Prioridad</label>
            <select
              name="prioridad"
              value={formData.prioridad}
              onChange={handleInputChange}
              required
              className="select-input"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="form-row">
            <Input
              label="Asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleInputChange}
              placeholder="Describe brevemente el problema"
              required
              fullWidth
            />
          </div>

          <div className="form-row">
            <label className="input-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe el problema en detalle..."
              required
              className="textarea-input"
              rows={5}
            />
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Ticket'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Support;