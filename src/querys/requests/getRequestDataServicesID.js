import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Obtiene las rutas de los servicios por ID
export const GetRequestDataServiceID = async (id) => {
    try {
        const query = `
      SELECT
        id_servicio_datos,
        id_servicio,
        lugar_origen,
        lugar_destino,
        tarifa
      FROM Servicios_datos
      WHERE id_servicio_datos = $1 AND active = true
    `;

        const result = await pool.query(query, [id]);

        // Valida que la consulta arroje valores
        if (result.rows.length > 0) {
            return result.rows;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestDataServicesID/GetRequestDataService', error);
        throw new Error('Ha ocurrido un error al obtener las rutas de los servicios en peticiones');
    }
};
