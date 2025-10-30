import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FaFileExcel, FaFilePdf, FaDownload } from 'react-icons/fa';
import './ExportModal.scss';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport,
  title = 'Exportar Datos',
  filename = 'export'
}) => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(selectedFormat, filename);
      onClose();
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
    >
      <div className="export-modal">
        <p className="export-modal__description">
          Selecciona el formato en el que deseas exportar los datos:
        </p>

        <div className="export-modal__formats">
          <div 
            className={`format-option ${selectedFormat === 'excel' ? 'active' : ''}`}
            onClick={() => setSelectedFormat('excel')}
          >
            <FaFileExcel className="format-icon format-icon--excel" />
            <div className="format-info">
              <h4>Excel</h4>
              <p>Archivo .xlsx editable</p>
            </div>
            <div className="format-radio">
              <input 
                type="radio" 
                checked={selectedFormat === 'excel'} 
                onChange={() => setSelectedFormat('excel')}
              />
            </div>
          </div>

          <div 
            className={`format-option ${selectedFormat === 'pdf' ? 'active' : ''}`}
            onClick={() => setSelectedFormat('pdf')}
          >
            <FaFilePdf className="format-icon format-icon--pdf" />
            <div className="format-info">
              <h4>PDF</h4>
              <p>Documento para imprimir</p>
            </div>
            <div className="format-radio">
              <input 
                type="radio" 
                checked={selectedFormat === 'pdf'} 
                onChange={() => setSelectedFormat('pdf')}
              />
            </div>
          </div>
        </div>

        <div className="export-modal__actions">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            icon={<FaDownload />}
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? 'Exportando...' : 'Exportar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;