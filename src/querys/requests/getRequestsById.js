import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DateConverter, ParseTime } from '../../auxiliary functions/dateConverter.js';
import { ChangeStructureRequest } from '../../auxiliary functions/functionAuxiliary.js';

// Obtiene la información de una petición
export const GetRequestByID = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, id)
            .query(`
                    SELECT
                        P.[id_peticion],
                        PS.[id_Pedido_Servicio],
                        SD.[id_servicio_datos],
                        CE.[id_Costos_Extras],
                        PR.[id_proveedor],
                        C.[id_cliente],
                        S.[id_servicio],
                        C.[nombre] AS cliente,
                        PR.[nombre] AS proveedor,
                        S.[nombre] AS servicio,
                        CO.[nombre] + ' ' + CO.[apellido] AS conductor,
                        CH.[placa] AS chasis,
                        CA.[placa] AS cabezal,
                        F.[placa] AS furgon,
                        P.[precio_total] AS monto,
                        P.[precio_proveedor],
                        P.[profit],
                        SD.[lugar_origen],
                        SD.[lugar_destino],
                        SD.[tarifa],
                        PS.[entrega_vacio],
                        PS.[fecha_limite],
                        CE.[precio] AS costoExtra,
                        CE.[descripcion],
                        P.[fecha_salida],
                        P.[hora_salida]
                    FROM Peticiones P
                    LEFT JOIN Pedido_Servicio PS ON PS.[id_peticion] = P.[id_peticion]
                    LEFT JOIN Servicios_datos SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                    LEFT JOIN Servicios S ON S.[id_servicio] = SD.[id_servicio]
                    LEFT JOIN Conductores CO ON CO.[id_conductor] = PS.[id_conductor]
                    LEFT JOIN Chasis CH ON CH.[id_chasis] = PS.[id_chasis]
                    LEFT JOIN Cabezal CA ON CA.[id_cabezal] = PS.[id_cabezal]
                    LEFT JOIN Furgon F ON F.[id_furgon] = PS.[id_furgon]
                    LEFT JOIN Clientes C ON C.[id_cliente] = P.[cliente_id]
                    LEFT JOIN Proveedores PR ON PR.[id_proveedor] = P.[proveedor_id]
                    LEFT JOIN Costos_Extras CE ON CE.[id_Pedido_Servicio] = PS.[id_Pedido_Servicio]
                    WHERE P.id_peticion = @ID
                `);

        // Valida si la consulta tiene datos
        if (result.recordset.length === 0) {
            return [];
        }

        let data = result.recordset.map(({fecha_creacion, fecha_salida, fecha_limite, hora_salida, fecha_finalizacion, ...rest}) => ({
            ...rest,
            fecha_creacion: DateConverter(fecha_creacion),
            fecha_salida: DateConverter(fecha_salida),
            hora_salida: ParseTime(hora_salida),
            fecha_finalizacion: DateConverter(fecha_finalizacion),
            fecha_limite: DateConverter(fecha_limite)
        }));

        return {
            data: ChangeStructureRequest(data)
        };
        
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'querys/requests/getRequestsById/GetRequestByID', error);
        throw new Error('Ha ocurrido un error al obtener la petición solicitada');
    }
}