import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene los servicios en las peticiones
export const GetRequestServices = async () => {
    try {
        const result = await pool.request()
            .query(`
                    SELECT 
                        [id_servicio],
                        [nombre]
                    FROM [Servicios]
                    WHERE [active] = 1
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/requests/getRequests/GetRequests', error);
        throw new Error('Ha ocurrido un error al obtener los servicios en peticiones');
    }
}