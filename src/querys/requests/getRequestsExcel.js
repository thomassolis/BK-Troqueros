import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DateConverter, ParseTime } from '../../auxiliary functions/dateConverter.js';

// Obtiene los datos a insertar en el archivo Excel
export const GetRequestsExcel = async (filters) => {
    try {
        const idPeticion = filters.idPeticion ? filters.idPeticion : null;
        const nameService = filters.nameService ? filters.nameService : null;
        const nameDriver = filters.nameDriver ? filters.nameDriver : null;
        const nameCustomer = filters.nameCustomer ? filters.nameCustomer : null;
        const status = filters.status ? filters.status : null;

        const request = await pool.request();

        // Obtenemos los servicios filtrados
        let query = `
            SELECT
                P.[id_peticion] AS ID,
                C.[nombre] AS cliente,
                S.[nombre] AS servicio,
                CO.[nombre] + ' ' + CO.[apellido] AS conductor,
                CH.[placa] AS chasis,
                CA.[placa] AS cabezal,
                F.[placa] AS furgon,
                P.[precio_total] AS monto,
                P.[precio_proveedor] AS [precio proveedor],
                P.[profit],
                P.[fecha_creacion],
                P.[fecha_salida],
                P.[hora_salida],
                P.[fecha_finalizacion],
                P.[status]                
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
        console.log(query)
        const result = await request.query(query);

        // Valida si la consulta tiene datos
        if (result.recordset.length === 0) {
            return [];
        }

        const data = result.recordset.map(({fecha_creacion, fecha_salida, hora_salida, fecha_finalizacion, ...rest}) => ({
            ...rest,
            ['fecha creacion']: DateConverter(fecha_creacion),
            ['fecha salida']: DateConverter(fecha_salida),
            ['hora salida']: ParseTime(hora_salida),
            ['fecha finalizacion']: DateConverter(fecha_finalizacion),
        }));

        return data;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestsExcel/GetRequestsExcel', error);
        throw new Error('Ha ocurrido un error al obtener las peticiones');
    }
}