import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Obtiene los datos a insertar en el archivo Excel
export const GetRequestsExcel = async (filters) => {
    try {
        const idPeticion = filters.idPeticion ? filters.idPeticion : null;
        const nameService = filters.nameService ? filters.nameService : null;
        const nameDriver = filters.nameDriver ? filters.nameDriver : null;
        const nameCustomer = filters.nameCustomer ? filters.nameCustomer : null;
        const status = filters.status ? filters.status : null;
        const startDate = filters.startDate ? filters.startDate : null;
        let endDate = (filters.endDate && startDate) ? filters.endDate : null;

        // Valida si la fecha startDate tiene fecha y si endDate es undefined
        if (startDate && !endDate) {
            endDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
        }

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
				PS.[numero_referencia] as SH,
				PS.[num_contenedor] as 'Número de Contenedor',
				ps.[size_contenedor] as 'Tamaño de Contenedor',
                P.[precio_total] AS monto,
				P.[fecha_creacion] as 'Creación de Petición',
                P.[fecha_salida] as 'Comienzo de Petición',                
				PR.[nombre] AS 'Nombre Proveedor',
                P.[precio_proveedor] AS 'Costo de Proveedor',
                P.[profit], 
				ps.comentario,
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
			LEFT JOIN Proveedores PR ON PR.[id_proveedor] = P.[proveedor_id]            
        `;

        const conditions = [];

        // Valida si hay filtros ha aplicar en la consulta
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

        if (startDate && endDate) {
            request.input("StartDate", sql.Date, startDate);
            request.input("EndDate", sql.Date, endDate);
            conditions.push(`P.[fecha_salida] BETWEEN @StartDate AND @EndDate`);
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
        

        const data = result.recordset.map(({...rest}) => ({
            ...rest,            
        }));

        return data;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestsExcel/GetRequestsExcel', error);
        throw new Error('Ha ocurrido un error al obtener las peticiones');
    }
}