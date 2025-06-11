import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene los conductores disponibles y activos del sistema
export const GetRequestDrivers = async () => {
    try {
        const result = await pool.request()
            .query(`
                    SELECT 
                        [id_conductor],
                        [nombre] + ' ' + [apellido] AS nombre
                    FROM [Troqueros].[dbo].[Conductores]
                    WHERE [status] = 'Disponible' AND [active] = 1
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestDrivers/GetRequestDrivers', error);
        throw new Error('Ha ocurrido un error al obtener los conductores en peticiones');
    }
}