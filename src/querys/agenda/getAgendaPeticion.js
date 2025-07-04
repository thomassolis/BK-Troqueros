import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Obtiene la agenda de las peticiones
export const GetAgendaPeticion = async () => {
    try {
        const result = await pool.request()
            .query(`
                SELECT
                    'Peticion: ' + C.[nombre] AS title,
                    CAST(CONVERT(VARCHAR(10), P.[fecha_salida], 120) + ' ' + CONVERT(VARCHAR(8), P.[hora_salida], 108) AS DATETIME) AS [start],
                    NULL AS [end],
                    CAST(0 AS BIT) AS allDay,
                    'Peticion' AS [type],
                    P.[id_peticion] AS peticion,
                    COUNT(PS.[id_Pedido_Servicio]) AS CantServicios
                FROM [Troqueros].[dbo].[Peticiones] P
                LEFT JOIN [Troqueros].[dbo].[Pedido_Servicio] PS ON PS.[id_peticion] = P.[id_peticion]
                LEFT JOIN [Troqueros].[dbo].[Clientes] C ON C.[id_cliente] = P.[cliente_id]
                WHERE 
                    P.[fecha_salida] >= DATEADD(MONTH, -1, EOMONTH(GETDATE(), -1))
                    AND P.[fecha_salida] < DATEADD(MONTH, 3, EOMONTH(GETDATE(), -1))
                GROUP BY 
                    P.[id_peticion],
                    C.[nombre],
                    P.[fecha_salida],
                    P.[hora_salida],
                    P.[fecha_creacion]
                ORDER BY P.[fecha_creacion]
            `);

        // Valida que hayan datos para mostrar
        if (result.recordset.length === 0) {
            return [];
        }

        // Agrupamos los detalles de las peticiones
        const data = result.recordset.map(({peticion, CantServicios, ...rest}) => ({
            ...rest,
            details: {
                peticion,
                CantServicios
            }
        }));
        
        return data;
    } catch (error) {
        const code = GenerateCodeError(modules.AGENDA, typeError.agendaNoEncontrada);
        HandleError(code, error.message, 'querys/agenda/getAgendaPeticion/GetAgendaPeticion', error);
        throw new Error('Ha ocurrido un error al obtener la agenda de las peticiones');
    }
}