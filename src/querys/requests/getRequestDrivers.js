import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';


// Obtiene los conductores disponibles y activos del sistema
export const GetRequestDrivers = async (filters) => {
    try {
        // Parsea la hora en formato de fecha
        filters.hora_salida = GetTime(filters.hora_salida);

        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    WITH ServiciosPorConductor AS (
                        SELECT 
                            PS.[id_conductor],
                            P.[fecha_salida],
                            MIN(P.[hora_salida]) AS hora_salida,
                            SUM(SD.[tiempo_estimado]) AS total_tiempo_estimado
                        FROM Pedido_Servicio PS
                        INNER JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        INNER JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                        GROUP BY
                            PS.[id_conductor], 
                            P.[fecha_salida]
                    )

                    SELECT 
                        C.[id_conductor],
                        C.[nombre] + ' ' + C.[apellido] +
                        CASE
                            WHEN SPC.[fecha_salida] IS NOT NULL 
                                AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPC.[total_tiempo_estimado], SPC.[hora_salida]))
                            THEN 
                                ' (' 
                                + CONVERT(varchar(5), SPC.[hora_salida], 108) + ' - ' 
                                + CONVERT(varchar(5), DATEADD(HOUR, SPC.[total_tiempo_estimado], SPC.[hora_salida]), 108) 
                                + ')'
                            ELSE ''
                        END AS nombre,
                        IIF(SPC.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPC.[total_tiempo_estimado], SPC.[hora_salida])), 
                            1, 
                            0
                        ) AS success
                    FROM Conductores C
                    LEFT JOIN ServiciosPorConductor SPC ON C.[id_conductor] = SPC.[id_conductor]
                    WHERE C.[status] = 'Disponible' AND C.[active] = 1
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