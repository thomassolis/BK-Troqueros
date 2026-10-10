import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Obtiene los proveedores activos del sistema
export const GetRequestSuppliers = async () => {
    try {
        const query = `
      SELECT 
        id_proveedor,
        nombre
      FROM Proveedores
      WHERE active = true
    `;

        const result = await pool.query(query);

        // Valida si la consulta arrojó datos
        if (result.rows.length > 0) {
            return result.rows;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SUPPLIERS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestSuppliers/GetRequestSuppliers', error);
        throw new Error('Ha ocurrido un error al obtener los proveedores en peticiones');
    }
};
