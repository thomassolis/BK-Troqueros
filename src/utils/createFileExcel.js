import ExcelJS from 'exceljs'
import { GenerateCodeError } from './getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { HandleError } from './HandleError.js';

// Crea una tabla con los datos de las peticiones
export const CreateTableExcelRequest = async (dataRequest) => {    
    try {
        const workbook = new ExcelJS.Workbook(); // Crea el archivo
        const worksheet = workbook.addWorksheet('Peticiones') // Agrega una nueva hoja de trabajo

        const headers = Object.keys(dataRequest[0]); // Obtiene los encabezados
        // Convierte el array de objetos a un array de array
        const rows = dataRequest.map(obj => headers.map(key => obj[key]));

        // Insertar header y datos
        worksheet.addRow(headers);
        worksheet.addRows(rows);

        // Aplicar filtro sobre la primera fila
        worksheet.autoFilter = {
            from: 'A1',
            to: `${String.fromCharCode(65 + headers.length - 1)}1`, 
        };

        // Aplicar estilos headers
        headers.forEach((_, i) => {
            const cell = worksheet.getCell(1, i + 1); // Fila 1, columna i+1
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF9C43' } // naranja oscuro
            };
            
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFF' },
                size: 12
            };
        });

        // Aplicar estilos filas
        rows.forEach((_, rowIndex) => {
            const excelRow = worksheet.getRow(rowIndex + 2); // Empieza desde la fila 2

            const isEven = (rowIndex % 2) === 0; // Valida si es par o impar

            // Recorre todas las columnas según cantidad de headers
            // Da Estilos a las filas
            for (let col = 1; col <= headers.length; col++) {
                const cell = excelRow.getCell(col); // Obtiene la celda
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: isEven ? 'FFFFFF' : 'FFE0B2' } // blanco o naranja claro
                };
                cell.font = {
                    size: 12
                };
            }
        });

        // Ajustar ancho de columnas automáticamente
        worksheet.columns.forEach((col, i) => {
            const columnValues = [headers[i], ...rows.map(r => r[i])];
            const maxLength = Math.max(...columnValues.map(val => val?.toString().length ?? 10));
            col.width = maxLength + 5;
        });

        // Exportar como Buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.fileNoDescargado);
        HandleError(code, error.message, 'utils/createFileExcel/CreateTableExcelRequest', error);
        throw new Error('Ha ocurrido un error al descargar el archivo de las peticiones');
    }
}