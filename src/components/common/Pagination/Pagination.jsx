import React from 'react';
import './Pagination.scss';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalItems
}) => {
  const maxVisiblePages = 5;

  // Calcular rango de páginas visibles
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-wrapper">
      {/* Selector de filas por página */}
      <div className="pagination-rows">
        <select 
          value={rowsPerPage} 
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="pagination-select"
        >
          <option value={10}>10 filas</option>
          <option value={20}>20 filas</option>
          <option value={30}>30 filas</option>
          <option value={50}>50 filas</option>
        </select>
      </div>

      {/* Botones de paginación */}
      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>

        {pages.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="pagination-btn pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>

      {/* Info de registros */}
      <div className="pagination-info">
        {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, totalItems)} de {totalItems}
      </div>
    </div>
  );
};

export default Pagination;