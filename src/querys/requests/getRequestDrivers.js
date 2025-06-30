import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene los conductores disponibles y activos del sistema
export const GetRequestDrivers = async (filters) => {
    try {
        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    SELECT 
                        C.[id_conductor],
                        C.[nombre] + ' ' + C.[apellido] +
                        CASE
                            WHEN P.[fecha_salida] = @FechaSalida AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])))
                                THEN 
                                    ' (' 
                                    + CONVERT(varchar(5), MIN(P.[hora_salida]), 108) + ' - ' 
                                    + CONVERT(varchar(5), DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])), 108) 
                                    + ')'
                                ELSE ''
                        END AS nombre,
                        IIF(P.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida]))), 
                            1, 
                            0
                        ) AS success
                    FROM [Troqueros].[dbo].[Conductores] C
                        LEFT JOIN Pedido_Servicio PS ON PS.[id_conductor] = C.[id_conductor]
                        LEFT JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        LEFT JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                    WHERE C.[status] = 'Disponible' AND C.[active] = 1
                    GROUP BY 
                        C.[id_conductor], 
                        C.[nombre], 
                        C.[apellido],
                        P.[fecha_salida]
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