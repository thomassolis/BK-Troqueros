import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GroupServicesByRequets } from '../../auxiliary functions/functionAuxiliary.js';
import { DateConverter, ParseTime } from '../../auxiliary functions/dateConverter.js';


//Establece el tamaño de la página
const PAGE_SIZE = 20;

export const GetRequests = async (filters) => {
    try {
        const page = filters.page ? parseInt(filters.page) : 1;
        const idPeticion = filters.idPeticion ? filters.idPeticion : null;
        const nameService = filters.nameService ? filters.nameService : null;
        const nameDriver = filters.nameDriver ? filters.nameDriver : null;
        const nameCustomer = filters.nameCustomer ? filters.nameCustomer : null;
        const status = filters.status ? filters.status : null;

        const request = await pool.request();
        request.input("Page", sql.Int, page);
        request.input("PageSize", sql.Int, PAGE_SIZE);

        // Obtenemos los servicios filtrados
        let query = `
            WITH ServiciosFiltrados AS (
                SELECT
                    P.[id_peticion],
                    P.[cliente_id],
                    P.[proveedor_id],
                    P.[precio_total] AS monto,
                    P.[precio_proveedor],
                    P.[profit],
                    P.[fecha_creacion],
                    P.[fecha_salida],
                    P.[hora_salida],
                    P.[fecha_finalizacion],
                    P.[status],
                    PS.[id_Pedido_Servicio],
                    S.[nombre] AS servicio,
                    CO.[nombre] + ' ' + CO.[apellido] AS conductor,
                    CH.[placa] AS chasis,
                    CA.[placa] AS cabezal,
                    F.[placa] AS furgon
                FROM Peticiones P
                LEFT JOIN Pedido_Servicio PS ON PS.[id_peticion] = P.[id_peticion]
                LEFT JOIN Clientes C ON C.[id_cliente] = P.[cliente_id]
                LEFT JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                LEFT JOIN Servicios S ON S.[id_servicio] = SD.[id_servicio]
                LEFT JOIN Conductores CO ON CO.[id_conductor] = PS.[id_conductor]
                LEFT JOIN Chasis CH ON CH.[id_chasis] = PS.[id_chasis]
                LEFT JOIN Cabezal CA ON CA.[id_cabezal] = PS.[id_cabezal]
                LEFT JOIN Furgon F ON F.[id_furgon] = PS.[id_furgon]
            
        `;
        const conditions = [];
        if (idPeticion) {
            request.input("IdPeticion", sql.VarChar, idPeticion);
            conditions.push(`P.[id_peticion] LIKE '%' + @IdPeticion + '%'`);
        }

        if (nameService) {
            request.input("NameService", sql.VarChar, nameService);
            conditions.push(`S.[nombre] LIKE '%' + @NameService + '%'`);
        }

        if (nameDriver) {
            request.input("NameDriver", sql.VarChar, nameDriver);
            conditions.push(`CO.[nombre] LIKE '%' + @NameDriver + '%'`);
        }

        if (nameCustomer) {
            request.input("NameCustomer", sql.VarChar, nameCustomer);
            conditions.push(`C.[nombre] LIKE '%' + @NameCustomer + '%'`);
        }

        if (status) {
            request.input("Status", sql.VarChar, status);
            conditions.push(`P.[status] = @Status`);
        }

        // Construye las condiciones de la consulta
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // Obtiene el total de peticiones
        query += `),
            PeticionesUnicas AS (
                SELECT DISTINCT
                    [id_peticion],
                    [cliente_id],
                    [proveedor_id],
                    [monto],
                    [precio_proveedor],
                    [profit],
                    [fecha_creacion],
                    [fecha_salida],
                    [hora_salida],
                    [fecha_finalizacion],
                    [status]
                FROM ServiciosFiltrados
            ),
            TotalCount AS (
                SELECT COUNT(*) AS totalRegistros FROM PeticionesUnicas
            ),
            PeticionesPaginadas AS (
                SELECT PU.*, T.[totalRegistros]
                FROM PeticionesUnicas PU
                CROSS JOIN TotalCount T
                ORDER BY PU.[fecha_creacion] DESC
                OFFSET (@Page - 1) * @PageSize ROWS
                FETCH NEXT @PageSize ROWS ONLY
            )
            SELECT
                PP.[id_peticion],
                C.[nombre] AS cliente,
                P.[nombre] AS proveedor,
                SF.[servicio],
                SF.[conductor],
                SF.[chasis],
                SF.[cabezal],
                SF.[furgon],
                PP.[monto],
                PP.[precio_proveedor],
                PP.[profit],
                PP.[fecha_creacion],
                PP.[fecha_salida],
                PP.[hora_salida],
                PP.[fecha_finalizacion],
                PP.[status],
                PP.[totalRegistros]
            FROM PeticionesPaginadas PP
            JOIN ServiciosFiltrados SF ON SF.[id_peticion] = PP.[id_peticion]
            LEFT JOIN Clientes C ON C.[id_cliente] = PP.[cliente_id]
            LEFT JOIN Proveedores P ON P.[id_proveedor] = PP.[proveedor_id]
            ORDER BY PP.[fecha_creacion] DESC
        `;

        const result = await request.query(query);

        // Valida si la consulta tiene datos
        if (result.recordset.length === 0) {
            return [];
        }

        let data = result.recordset.map(({totalRegistros, fecha_creacion, fecha_salida, hora_salida, fecha_finalizacion, ...rest}) => ({
            ...rest,
            fecha_creacion: DateConverter(fecha_creacion),
            fecha_salida: DateConverter(fecha_salida),
            hora_salida: ParseTime(hora_salida),
            fecha_finalizacion: DateConverter(fecha_finalizacion),
        }));

        return {
            data: GroupServicesByRequets(data),
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        }
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'querys/requests/getRequests/GetRequests', error);
        throw new Error('Ha ocurrido un error al obtener las peticiones');
    }
}