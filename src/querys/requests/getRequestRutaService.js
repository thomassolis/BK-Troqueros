import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Obtiene las rutas de los servicios
export const GetRequestRutaServices = async (id) => {
  try {
    const baseQuery = `
      SELECT
        id_servicio_datos,
        lugar_origen || ' - ' || lugar_destino AS ruta
      FROM Servicios_datos
      WHERE active = true
    `;

    // En PostgreSQL los parámetros se pasan con $1, $2, etc.
    const queryWithFilter = id ? `${baseQuery} AND id_servicio = $1` : baseQuery;

    const values = id ? [id] : [];

    const result = await pool.query(queryWithFilter, values);

    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
    HandleError(code, error.message, 'querys/requests/getRequestDataService/GetRequestDataServices', error);
    throw new Error('Ha ocurrido un error al obtener las rutas de los servicios en peticiones');
  }
};
