import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Establece el tamaño de la página
const PAGE_SIZE = 20;

// Obtiene los servicios del sistema
export const GetServices = async (filters) => {
    try {
        let query = `
            WITH ServiciosPaginados AS (
                SELECT
                    S.[id_servicio],
                    S.[nombre],
                    CEILING(COUNT(*) OVER()) AS "totalRegistros"
                FROM Servicios S
                WHERE 
        `;

        // Valida si esta filtrando por el nombre del servicio
        if (filters.search) {
            query += `S.[nombre] ILIKE CONCAT('%', @Search, '%') AND `
        }

        query += `
                [active] = @Active
                ORDER BY S.[nombre]
                OFFSET (@Page - 1) * @PageSize ROWS
                FETCH NEXT @PageSize ROWS ONLY
            )
            SELECT
                SP.[id_servicio],
                SP.[nombre],
                (
                    SELECT COALESCE(json_agg(
                        json_build_object(
                            'id_servicio_datos', SD.id_servicio_datos,
                            'lugar_origen', SD.lugar_origen,
                            'lugar_destino', SD.lugar_destino,
                            'tarifa', SD.tarifa,
                            'tiempo_estimado', SD.tiempo_estimado
                        )
                    ), '[]'::json)
                    FROM Servicios_datos SD
                    WHERE SD.id_servicio = SP.id_servicio AND SD.active = @Active
                ) AS pedidos,
                SP."totalRegistros"
            FROM ServiciosPaginados SP
        `;

        const result = await pool.request()
            .input("Page", sql.Int, filters.page ? parseInt(filters.page) : 1)
            .input("Search", sql.VarChar, filters.search)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, filters.active ? filters.active : true)
            .query(query);

        // Valida que haya datos
        if (result.recordset.length === 0) {
            return [];
        }

        return {
            data: result.recordset.map(row => {
                const { totalRegistros, totalregistros, pedidos, ...rest } = row;

                let parsedPedidos = [];
                if (Array.isArray(pedidos)) {
                    parsedPedidos = pedidos;
                } else if (typeof pedidos === 'string') {
                    try { parsedPedidos = JSON.parse(pedidos); } catch (e) { parsedPedidos = []; }
                }

                return {
                    ...rest,
                    pedidos: parsedPedidos
                };
            }),
            paginaActual: parseInt(filters.page) || 1,
            totalRegistros: Number(result.recordset[0]?.totalRegistros ?? result.recordset[0]?.totalregistros ?? 0),
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/services/getServices/GetAllServices', error);
        throw new Error('Ha ocurrido un error al obtener los servicios solicitados');
    }
}