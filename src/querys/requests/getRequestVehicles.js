import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene los chasis disponibles y activos del sistema
export const GetRequestChassis = async (filters) => {
    try {
        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    SELECT 
                        C.[id_chasis],
                        C.[placa] +
                        CASE
                            WHEN P.[fecha_salida] = @FechaSalida AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])))
                                THEN 
                                    ' (' 
                                    + CONVERT(varchar(5), MIN(P.[hora_salida]), 108) + ' - ' 
                                    + CONVERT(varchar(5), DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])), 108) 
                                    + ')'
                                ELSE ''
                        END AS placa,
                        IIF(P.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida]))), 
                            1, 
                            0
                        ) AS success
                    FROM [Troqueros].[dbo].[Chasis] C
                        LEFT JOIN Pedido_Servicio PS ON PS.[id_chasis] = C.[id_chasis]
                        LEFT JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        LEFT JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                    WHERE C.[status] = 'Disponible' AND C.[active] = 1
                    GROUP BY 
                        C.[id_chasis], 
                        C.[placa],
                        P.[fecha_salida]
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestChssis', error);
        throw new Error('Ha ocurrido un error al obtener los chasis en peticiones');
    }
}


// Obtiene los cabezal disponibles y activos del sistema
export const GetRequestTruckHead = async (filters) => {
    try {
        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    SELECT 
                        C.[id_cabezal],
                        C.[placa] +
                        CASE
                            WHEN P.[fecha_salida] = @FechaSalida AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])))
                                THEN 
                                    ' (' 
                                    + CONVERT(varchar(5), MIN(P.[hora_salida]), 108) + ' - ' 
                                    + CONVERT(varchar(5), DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])), 108) 
                                    + ')'
                                ELSE ''
                        END AS placa,
                        IIF(P.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida]))), 
                            1, 
                            0
                        ) AS success
                    FROM [Troqueros].[dbo].[Cabezal] C
                        LEFT JOIN Pedido_Servicio PS ON PS.[id_cabezal] = C.[id_cabezal]
                        LEFT JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        LEFT JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                    WHERE C.[status] = 'Disponible' AND C.[active] = 1
                    GROUP BY 
                        C.[id_cabezal], 
                        C.[placa],
                        P.[fecha_salida]
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestTruckHead', error);
        throw new Error('Ha ocurrido un error al obtener los cabezal en peticiones');
    }
}


// Obtiene los furgon disponibles y activos del sistema
export const GetRequestTruckVan = async (filters) => {
    try {
        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    SELECT 
                        F.[id_furgon],
                        F.[placa] +
                        CASE
                            WHEN P.[fecha_salida] = @FechaSalida AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])))
                                THEN 
                                    ' (' 
                                    + CONVERT(varchar(5), MIN(P.[hora_salida]), 108) + ' - ' 
                                    + CONVERT(varchar(5), DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida])), 108) 
                                    + ')'
                                ELSE ''
                        END AS placa,
                        IIF(P.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SUM(SD.[tiempo_estimado]), MIN(P.[hora_salida]))), 
                            1, 
                            0
                        ) AS success
                    FROM [Troqueros].[dbo].[Furgon] F
                        LEFT JOIN Pedido_Servicio PS ON PS.[id_furgon] = F.[id_furgon]
                        LEFT JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        LEFT JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                    WHERE F.[status] = 'Disponible' AND F.[active] = 1
                    GROUP BY 
                        F.[id_furgon], 
                        F.[placa],
                        P.[fecha_salida]
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.FURGONES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestTruckVan', error);
        throw new Error('Ha ocurrido un error al obtener los furgon en peticiones');
    }
}