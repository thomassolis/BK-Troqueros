import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene las rutas de los servicios
export const GetRequestRutaServices = async (id) => {
  try {
    const baseQuery = `
      SELECT
        [id_servicio_datos],
        [lugar_origen] + ' - ' + [lugar_destino] AS ruta
      FROM [Troqueros].[dbo].[Servicios_datos]
      WHERE [active] = 1
    `;

    const queryWithFilter = id ? `${baseQuery} AND [id_servicio] = @ID` : baseQuery;

    const request = pool.request();
    if (id) {
      request.input("ID", sql.VarChar, id);
    }

    const result = await request.query(queryWithFilter);

    return result.recordset.length > 0 ? result.recordset : null;
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
    HandleError(code, error.message, 'querys/requests/getRequestDataService/GetRequestDataServices', error);
    throw new Error('Ha ocurrido un error al obtener las rutas de los servicios en peticiones');
  }
};
