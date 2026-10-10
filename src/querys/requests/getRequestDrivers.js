import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';

// Obtiene los conductores disponibles y activos del sistema
export const GetRequestDrivers = async (filters) => {
    try {
        // Parsea la hora en formato HH:MM:SS
        filters.hora_salida = GetTime(filters.hora_salida);

        let values = [filters.fecha_salida, filters.hora_salida];
        let query = `
      WITH ServiciosPorConductor AS (
        SELECT 
          PS.id_conductor,
          P.fecha_salida,
          MIN(P.hora_salida) AS hora_salida,
          SUM(SD.tiempo_estimado) AS total_tiempo_estimado
        FROM Pedido_Servicio PS
        INNER JOIN Peticiones P ON P.id_peticion = PS.id_peticion
        INNER JOIN Servicios_datos SD ON SD.id_servicio_datos = PS.id_servicio_datos
        WHERE P.fecha_salida = $1
    `;

        if (filters.IdPeticion) {
            values.push(filters.IdPeticion);
            query += ` AND P.id_peticion <> $${values.length}`;
        }

        query += `
        GROUP BY PS.id_conductor, P.fecha_salida
      )
      SELECT 
        C.id_conductor,
        C.nombre || ' ' || C.apellido ||
        CASE
          WHEN SPC.fecha_salida IS NOT NULL 
            AND $2::time <= (SPC.hora_salida + (COALESCE(SPC.total_tiempo_estimado,0) || ' hours')::interval)
          THEN ' (' || to_char(SPC.hora_salida, 'HH24:MI') || ' - ' ||
               to_char(SPC.hora_salida + (COALESCE(SPC.total_tiempo_estimado,0) || ' hours')::interval, 'HH24:MI') || ')'
          ELSE ''
        END AS nombre,
        CASE
          WHEN SPC.fecha_salida = $1
            AND $2::time <= (SPC.hora_salida + (COALESCE(SPC.total_tiempo_estimado,0) || ' hours')::interval)
          THEN 1 ELSE 0
        END AS success
      FROM Conductores C
      LEFT JOIN ServiciosPorConductor SPC ON SPC.id_conductor = C.id_conductor
      WHERE C.status = 'Disponible' AND C.active = true
    `;

        const result = await pool.query(query, values);

        return result.rows.length > 0 ? result.rows : null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestDrivers/GetRequestDrivers', error);
        throw new Error('Ha ocurrido un error al obtener los conductores en peticiones');
    }
};
