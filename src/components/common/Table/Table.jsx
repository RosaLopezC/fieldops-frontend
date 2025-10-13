import React from 'react';
import './Table.scss';

const Table = ({ 
  columns, 
  data, 
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  striped = true,
  hoverable = true
}) => {
  const tableClasses = [
    'table',
    striped && 'table--striped',
    hoverable && 'table--hoverable'
  ].filter(Boolean).join(' ');

  return (
    <div className="table-wrapper">
      <table className={tableClasses}>
        <thead className="table__head">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="table__header"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={onRowClick ? 'table__row--clickable' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table__cell">
                    {column.render 
                      ? column.render(row[column.accessor], row, rowIndex)
                      : row[column.accessor]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;