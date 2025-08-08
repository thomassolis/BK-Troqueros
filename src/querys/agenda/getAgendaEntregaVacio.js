import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { OrganizeEmptyDeliveryDates } from '../../auxiliary functions/functionAuxiliary.js';

// Obtiene la agenda de los servicios con entregas vacios
export const GetAgendaEntregaVacio = async () => {
    try {
        const result = await pool.request()
            .query(`
                SELECT
                    'Entrega Vacio' AS title,
                    CAST(CONVERT(VARCHAR(10), PS.[fecha_limite], 120) + ' ' + CONVERT(VARCHAR(8), P.[hora_salida], 108) AS DATETIME) AS [start],
                    CAST(0 AS BIT) AS allDay,
                    'Vacio' AS [type],
                    C.[nombre] AS cliente,
                    P.[id_peticion] AS peticion,
                    ps.[num_contenedor] as numero_contenedor,
					ps.numero_referencia as sh,
					ps.size_contenedor as size_contenedor,
                    ps.id_Pedido_Servicio as id_Pedido_Servicio,
                    ps.vacio_entregado
                FROM [Troqueros].[dbo].[Peticiones] P
                LEFT JOIN [Troqueros].[dbo].[Pedido_Servicio] PS ON PS.[id_peticion] = P.[id_peticion]
                LEFT JOIN [Troqueros].[dbo].[Clientes] C ON C.[id_cliente] = P.[cliente_id]
                WHERE PS.[entrega_vacio] = 1
                    AND P.[fecha_salida] >= DATEADD(MONTH, -1, EOMONTH(GETDATE(), -1))
                    AND P.[fecha_salida] < DATEADD(MONTH, 3, EOMONTH(GETDATE(), -1))
					AND P.[proveedor_id] IS NULL
                ORDER BY P.[fecha_creacion]
            `);

        // Valida que hayan datos para mostrar
        if (result.recordset.length === 0) {
            return [];
        }

        // Agrupamos los detalles del servicio con entrega vacio
        const data = result.recordset.map(({cliente, peticion,size_contenedor, sh, numero_contenedor,id_Pedido_Servicio,vacio_entregado,  ...rest}) => ({
            ...rest,
            details: {
                cliente,
                peticion,
                size_contenedor,
                sh,
                vacio_entregado,
                numero_contenedor,
                id_Pedido_Servicio
            }
        }));
        
        return OrganizeEmptyDeliveryDates(data);
    } catch (error) {
        const code = GenerateCodeError(modules.AGENDA, typeError.agendaNoEncontrada);
        HandleError(code, error.message, 'querys/agenda/getagendaEntregaVacio/GetAgendaEntregaVacio', error);
        throw new Error('Ha ocurrido un error al obtener la agenda de las entregas de vacios');
    }
}