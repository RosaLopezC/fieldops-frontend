import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Exportar datos a Excel
 */
export const exportToExcel = (data, filename = 'reporte') => {
  try {
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Convertir datos a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Ajustar ancho de columnas automáticamente
    const maxWidth = 50;
    const wscols = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }));
    ws['!cols'] = wscols;
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Generar archivo y descargar
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return { success: true };
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return { success: false, error };
  }
};

/**
 * Exportar datos a CSV
 */
export const exportToCSV = (data, filename = 'reporte') => {
  try {
    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Agregar worksheet
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Generar archivo CSV
    XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
    
    return { success: true };
  } catch (error) {
    console.error('Error al exportar a CSV:', error);
    return { success: false, error };
  }
};

/**
 * Exportar datos a PDF
 */
export const exportToPDF = (data, filename = 'reporte', title = 'Reporte') => {
  try {
    // Crear documento PDF
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape, milímetros, tamaño A4
    
    // Configurar fuente
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    
    // Título
    doc.text(title, 14, 15);
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado: ${new Date().toLocaleString('es-PE')}`, 14, 22);
    
    // Preparar columnas y filas
    if (data.length === 0) {
      doc.text('No hay datos para mostrar', 14, 35);
    } else {
      // Extraer headers (claves del primer objeto)
      const headers = Object.keys(data[0]).map(key => ({
        header: formatHeader(key),
        dataKey: key
      }));
      
      // Generar tabla
      doc.autoTable({
        startY: 28,
        head: [headers.map(h => h.header)],
        body: data.map(row => headers.map(h => row[h.dataKey] || '')),
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [0, 102, 204], // Color azul
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 14, right: 14 }
      });
    }
    
    // Pie de página con número de páginas
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Guardar PDF
    doc.save(`${filename}.pdf`);
    
    return { success: true };
  } catch (error) {
    console.error('Error al exportar a PDF:', error);
    return { success: false, error };
  }
};

/**
 * Formatear nombre de header (de snake_case a Title Case)
 */
const formatHeader = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Función principal de exportación
 */
export const exportData = async (format, data, filename, title) => {
  try {
    let result;
    
    switch (format) {
      case 'excel':
      case 'xlsx':
        result = exportToExcel(data, filename);
        break;
      case 'csv':
        result = exportToCSV(data, filename);
        break;
      case 'pdf':
        result = exportToPDF(data, filename, title);
        break;
      default:
        throw new Error('Formato no soportado');
    }
    
    return result;
  } catch (error) {
    console.error('Error en exportación:', error);
    return { success: false, error };
  }
};