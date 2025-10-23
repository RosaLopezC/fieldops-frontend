import * as XLSX from 'xlsx';

/**
 * Exportar datos a Excel
 */
export const exportToExcel = (data, filename = 'export') => {
  try {
    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Convertir datos a hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Generar archivo y descargar
    XLSX.writeFile(wb, `${filename}_${new Date().getTime()}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    throw error;
  }
};

/**
 * Exportar datos a PDF (usando impresión del navegador)
 */
export const exportToPDF = (data, filename = 'export') => {
  try {
    // Crear una ventana nueva para imprimir
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('No se pudo abrir ventana de impresión. Verifica que los popups estén permitidos.');
    }
    
    // Crear el HTML para el PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #0066cc;
              font-size: 24px;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #0066cc;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .metadata {
              margin-bottom: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>FieldOps - ${filename}</h1>
          <div class="metadata">
            <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleString('es-PE')}</p>
            <p><strong>Total de registros:</strong> ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.values(row).map(value => `<td>${value || '-'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Esperar a que cargue y luego abrir diálogo de impresión
    printWindow.onload = () => {
      printWindow.print();
      // No cerrar la ventana automáticamente para que el usuario pueda revisar
    };
    
    return true;
  } catch (error) {
    console.error('Error al exportar a PDF:', error);
    throw error;
  }
};

/**
 * Mostrar modal de selección de formato
 */
export const showExportModal = (onExcel, onPDF) => {
  return new Promise((resolve) => {
    const result = window.confirm(
      '📥 EXPORTAR DATOS\n\n' +
      'Selecciona el formato de exportación:\n\n' +
      '✅ ACEPTAR = Excel (.xlsx)\n' +
      '❌ CANCELAR = PDF (Impresión)'
    );
    
    if (result) {
      onExcel();
    } else {
      onPDF();
    }
    
    resolve(result);
  });
};