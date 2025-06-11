import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene los proveedores activos del sistema
export const GetRequestSuppliers = async () => {
    try {
        const result = await pool.request()
            .query(`
                    SELECT 
                        [id_proveedor],
                        [nombre]
                    FROM [Troqueros].[dbo].[Proveedores]
                    WHERE [active] = 1
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SUPPLIERS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestSuppliers/GetRequestSuppliers', error);
        throw new Error('Ha ocurrido un error al obtener los proveedores en peticiones');
    }
}