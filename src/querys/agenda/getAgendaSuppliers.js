import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene las agenda de los servicios con entregas de proveedores
export const GetAgendaSuppliers = async () => {
    try {
        const result = await pool.request()
            .query(`
                SELECT
                    'Entrega Proveedor: ' + S.[nombre] AS title,
                    CAST(CONVERT(VARCHAR(10), P.[fecha_salida], 120) + ' ' + CONVERT(VARCHAR(8), P.[hora_salida], 108) AS VARCHAR) AS [start],
					CONVERT(VARCHAR(19), 
                        DATEADD(HOUR, ISNULL(SUM(SD.[tiempo_estimado]), 0), 
                            CAST(CONVERT(VARCHAR(10), P.[fecha_salida], 120) + ' ' + CONVERT(VARCHAR(8), P.[hora_salida], 108) AS DATETIME)
                        ), 120
                    ) AS [end],
                    CAST(0 AS BIT) AS allDay,
                    'Proveedor' AS [type],
                    C.[nombre] AS cliente,
                    P.[id_peticion] AS peticion
                FROM [Troqueros].[dbo].[Peticiones] P
                LEFT JOIN [Troqueros].[dbo].[Pedido_Servicio] PS ON PS.[id_peticion] = P.[id_peticion]
                LEFT JOIN [Troqueros].[dbo].[Servicios_datos] SD ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
                LEFT JOIN [Troqueros].[dbo].[Servicios] S ON S.[id_servicio] = SD.[id_servicio]
                LEFT JOIN [Troqueros].[dbo].[Clientes] C ON C.[id_cliente] = P.[cliente_id]
                WHERE P.[fecha_salida] >= DATEADD(MONTH, -1, EOMONTH(GETDATE(), -1))
                    AND P.[fecha_salida] < DATEADD(MONTH, 3, EOMONTH(GETDATE(), -1))
					AND P.[proveedor_id] IS NOT NULL
				GROUP BY
					P.[id_peticion],
					P.[proveedor_id],
					P.[fecha_salida],
					P.[hora_salida],
					S.[nombre],
					C.[nombre],
					P.[fecha_creacion]
                ORDER BY P.[fecha_creacion]      
            `);

        // Valida que hayan datos para mostrar
        if (result.recordset.length === 0) {
            return [];
        }

        // Agrupamos los detalles del servicio con entrega vacio
        const data = result.recordset.map(({cliente, peticion, ...rest}) => ({
            ...rest,
            details: {
                cliente,
                peticion
            }
        }));

        return data;
    } catch (error) {
        const code = GenerateCodeError(modules.AGENDA, typeError.agendaNoEncontrada);
        HandleError(code, error.message, 'querys/agenda/getagendaEntregaVacio/GetAgendaEntregaVacio', error);
        throw new Error('Ha ocurrido un error al obtener la agenda de las entregas de vacios');
    }
}