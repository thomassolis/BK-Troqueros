import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';


// Obtiene los chasis disponibles y activos del sistema
export const GetRequestChassis = async (filters) => {
    try {
        // Parsea la hora en formato de fecha
        filters.hora_salida = GetTime(filters.hora_salida);

        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    WITH ServiciosPorChasis AS (
                        SELECT 
                            PS.[id_chasis],
                            P.[fecha_salida],
                            MIN(P.[hora_salida]) AS hora_salida,
                            SUM(SD.[tiempo_estimado]) AS total_tiempo_estimado
                        FROM Pedido_Servicio PS
                        INNER JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        INNER JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                        GROUP BY
                            PS.[id_chasis], 
                            P.[fecha_salida]
                    )

                    SELECT 
                        CH.[id_chasis],
                        CH.[placa] +
                        CASE
                            WHEN SPCH.[fecha_salida] IS NOT NULL 
                                AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPCH.[total_tiempo_estimado], SPCH.[hora_salida]))
                            THEN 
                                ' (' 
                                + CONVERT(varchar(5), SPCH.[hora_salida], 108) + ' - ' 
                                + CONVERT(varchar(5), DATEADD(HOUR, SPCH.[total_tiempo_estimado], SPCH.[hora_salida]), 108) 
                                + ')'
                            ELSE ''
                        END AS placa,
                        IIF(SPCH.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPCH.[total_tiempo_estimado], SPCH.[hora_salida])), 
                            1, 
                            0
                        ) AS success
                    FROM Chasis CH
                    LEFT JOIN ServiciosPorChasis SPCH ON SPCH.[id_chasis] = CH.[id_chasis]
                    WHERE CH.[status] = 'Disponible' AND CH.[active] = 1
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
        // Parsea la hora en formato de fecha
        filters.hora_salida = GetTime(filters.hora_salida);

        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    WITH ServiciosPorCabezal AS (
                        SELECT 
                            PS.[id_cabezal],
                            P.[fecha_salida],
                            MIN(P.[hora_salida]) AS hora_salida,
                            SUM(SD.[tiempo_estimado]) AS total_tiempo_estimado
                        FROM Pedido_Servicio PS
                        INNER JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        INNER JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                        GROUP BY
                            PS.[id_cabezal], 
                            P.[fecha_salida]
                    )

                    SELECT 
                        CA.[id_cabezal],
                        CA.[placa] +
                        CASE
                            WHEN SPCA.[fecha_salida] IS NOT NULL 
                                AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPCA.[total_tiempo_estimado], SPCA.[hora_salida]))
                            THEN 
                                ' (' 
                                + CONVERT(varchar(5), SPCA.[hora_salida], 108) + ' - ' 
                                + CONVERT(varchar(5), DATEADD(HOUR, SPCA.[total_tiempo_estimado], SPCA.[hora_salida]), 108) 
                                + ')'
                            ELSE ''
                        END AS placa,
                        IIF(SPCA.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPCA.[total_tiempo_estimado], SPCA.[hora_salida])), 
                            1, 
                            0
                        ) AS success
                    FROM Cabezal CA
                    LEFT JOIN ServiciosPorCabezal SPCA ON SPCA.[id_cabezal] = CA.[id_cabezal]
                    WHERE CA.[status] = 'Disponible' AND CA.[active] = 1
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
        // Parsea la hora en formato de fecha
        filters.hora_salida = GetTime(filters.hora_salida);

        const result = await pool.request()
            .input("FechaSalida", sql.Date, filters.fecha_salida)
            .input("HoraSalida", sql.Time, filters.hora_salida)
            .query(`
                    WITH ServiciosPorFurgon AS (
                        SELECT 
                            PS.[id_furgon],
                            P.[fecha_salida],
                            MIN(P.[hora_salida]) AS hora_salida,
                            SUM(SD.[tiempo_estimado]) AS total_tiempo_estimado
                        FROM Pedido_Servicio PS
                        INNER JOIN Peticiones P ON P.[id_peticion] = PS.[id_peticion] AND P.[fecha_salida] = @FechaSalida
                        INNER JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                        GROUP BY
                            PS.[id_furgon], 
                            P.[fecha_salida]
                    )

                    SELECT 
                        FU.[id_furgon],
                        FU.[placa] +
                        CASE
                            WHEN SPFU.[fecha_salida] IS NOT NULL 
                                AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPFU.[total_tiempo_estimado], SPFU.[hora_salida]))
                            THEN 
                                ' (' 
                                + CONVERT(varchar(5), SPFU.[hora_salida], 108) + ' - ' 
                                + CONVERT(varchar(5), DATEADD(HOUR, SPFU.[total_tiempo_estimado], SPFU.[hora_salida]), 108) 
                                + ')'
                            ELSE ''
                        END AS placa,
                        IIF(SPFU.[fecha_salida] = @FechaSalida
                            AND CONVERT(TIME, @HoraSalida) <= CONVERT(TIME, DATEADD(HOUR, SPFU.[total_tiempo_estimado], SPFU.[hora_salida])), 
                            1, 
                            0
                        ) AS success
                    FROM Furgon FU
                    LEFT JOIN ServiciosPorFurgon SPFU ON SPFU.[id_furgon] = FU.[id_furgon]
                    WHERE FU.[status] = 'Disponible' AND FU.[active] = 1
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