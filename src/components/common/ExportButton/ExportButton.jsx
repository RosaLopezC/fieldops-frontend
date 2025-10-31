import React, { useState } from 'react';
import { FaFileExport, FaFileExcel, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import Modal from '../Modal';
import Button from '../Button';
import './ExportButton.scss';

const ExportButton = ({
  onExport,
  data = [],
  filename = 'reporte',
  className = '',
  disabled = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const exportFormats = [
    {
      id: 'excel',
      name: 'Excel',
      icon: <FaFileExcel />,
      extension: '.xlsx',
      description: 'Exportar como archivo Excel',
      color: '#1D6F42'
    },
    {
      id: 'pdf',
      name: 'PDF',
      icon: <FaFilePdf />,
      extension: '.pdf',
      description: 'Exportar como documento PDF',
      color: '#E53935'
    },
    {
      id: 'csv',
      name: 'CSV',
      icon: <FaFileCsv />,
      extension: '.csv',
      description: 'Exportar como archivo CSV',
      color: '#0066CC'
    }
  ];

  const handleOpenModal = () => {
    if (data.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!exporting) {
      setIsModalOpen(false);
      setSelectedFormat(null);
    }
  };

  const handleExport = async () => {
    if (!selectedFormat) {
      alert('Por favor selecciona un formato');
      return;
    }

    setExporting(true);

    try {
      await onExport(selectedFormat, filename);
      
      // Simular delay para mejor UX
      setTimeout(() => {
        setExporting(false);
        setIsModalOpen(false);
        setSelectedFormat(null);
      }, 1000);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar. Inténtalo de nuevo.');
      setExporting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        leftIcon={<FaFileExport />}
        onClick={handleOpenModal}
        disabled={disabled || data.length === 0}
        className={className}
      >
        Exportar
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Exportar Datos"
        size="medium"
        closeOnOverlayClick={!exporting}
        closeOnEsc={!exporting}
      >
        <div className="export-modal">
          <p className="export-modal-description">
            Selecciona el formato en el que deseas exportar los datos.
          </p>

          <div className="export-formats">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                className={`export-format-card ${selectedFormat === format.id ? 'selected' : ''}`}
                onClick={() => setSelectedFormat(format.id)}
                disabled={exporting}
              >
                <div 
                  className="export-format-icon"
                  style={{ color: format.color }}
                >
                  {format.icon}
                </div>
                <div className="export-format-info">
                  <h4 className="export-format-name">{format.name}</h4>
                  <p className="export-format-description">{format.description}</p>
                  <span className="export-format-extension">{format.extension}</span>
                </div>
                <div className="export-format-check">
                  {selectedFormat === format.id && (
                    <div className="check-circle">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="export-info">
            <p>
              <strong>Total de registros:</strong> {data.length}
            </p>
            <p>
              <strong>Nombre del archivo:</strong> {filename}{exportFormats.find(f => f.id === selectedFormat)?.extension || ''}
            </p>
          </div>

          <Modal.Footer
            onCancel={handleCloseModal}
            onConfirm={handleExport}
            cancelText="Cancelar"
            confirmText={exporting ? 'Exportando...' : 'Exportar'}
            confirmLoading={exporting}
            confirmDisabled={!selectedFormat || exporting}
            confirmVariant="primary"
          />
        </div>
      </Modal>
    </>
  );
};

export default ExportButton;