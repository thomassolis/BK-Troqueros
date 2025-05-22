import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtuene todos los servicios del sistema
export const GetAllServices = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
            .input("Page", sql.Int, page)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .query(`
                    WITH ServiciosPaginados AS (
                        SELECT
                            S.id_servicio,
                            S.nombre,
                            CEILING(COUNT(*) OVER()) AS totalRegistros
                        FROM Servicios S
                        ORDER BY S.nombre
                        OFFSET (@Page - 1) * @PageSize ROWS
                        FETCH NEXT @PageSize ROWS ONLY
                    )
                    SELECT
                        SP.id_servicio,
                        SP.nombre,
                        JSON_QUERY(
                            (
                                SELECT
                                    SD.id_servicio_datos,
                                    SD.lugar_origen,
                                    SD.lugar_destino,
                                    SD.tarifa
                                FROM Servicios_datos SD
                                WHERE SD.id_servicio = SP.id_servicio
                                FOR JSON PATH
                            )
                        ) AS pedidos,
                        SP.totalRegistros
                    FROM ServiciosPaginados SP
                `)

        // Valida que haya datos
        if (result.recordset.length === 0) {
            return [];
        }

        return {
            data: result.recordset.map(row => {
                const { totalRegistros, pedidos, ...rest } = row;

                return {
                    ...rest,
                    pedidos: pedidos ? JSON.parse(pedidos) : [] // convierte pedidos a JSON o [] si está vacío
                };
            }),
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/services/getServices/GetAllServices', error);
        throw new Error('Ha ocurrido un error al obtener todos los servicios');
    }
}



export const GetServicesByFilter = async (page, search) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 1;

        const result = await pool.request()
            .input("Page", sql.Int, page)
            .input("Search", sql.VarChar, search)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .query(`
                    WITH ServiciosPaginados AS (
                        SELECT
                            S.id_servicio,
                            S.nombre,
                            CEILING(COUNT(*) OVER()) AS totalRegistros
                        FROM Servicios S
                        WHERE S.nombre LIKE '%' + @Search + '%'
                        ORDER BY S.nombre
                        OFFSET (@Page - 1) * @PageSize ROWS
                        FETCH NEXT @PageSize ROWS ONLY
                    )
                    SELECT
                        SP.id_servicio,
                        SP.nombre,
                        JSON_QUERY(
                            (
                                SELECT
                                    SD.id_servicio_datos,
                                    SD.lugar_origen,
                                    SD.lugar_destino,
                                    SD.tarifa
                                FROM Servicios_datos SD
                                WHERE SD.id_servicio = SP.id_servicio
                                FOR JSON PATH
                            )
                        ) AS pedidos,
                        SP.totalRegistros
                    FROM ServiciosPaginados SP
                `)

        // Valida que haya datos
        if (result.recordset.length === 0) {
            return [];
        }

        return {
            data: result.recordset.map(row => {
                const { totalRegistros, pedidos, ...rest } = row;

                return {
                    ...rest,
                    pedidos: pedidos ? JSON.parse(pedidos) : [] // convierte pedidos a JSON o [] si está vacío
                };
            }),
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/services/getServices/GetAllServices', error);
        throw new Error('Ha ocurrido un error al obtener los servicios solicitados');
    }
}