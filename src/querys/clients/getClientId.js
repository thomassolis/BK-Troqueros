import { DateConverter } from '../../auxiliary functions/dateConverter.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from 'mssql';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';


export const GetClientById = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, id)
            .query(`
                    SELECT
                        C.[id_cliente],
                        C.[nombre],
                        C.[ruc_empresa] AS ruc,
                        C.[direccion],
                        C.[nombre_persona_contacto] AS nombrePersonaContacto,
                        C.[telefono_persona_contacto] AS telPersonaContacto,
                        C.[email_persona_contacto] AS emailPersonaContacto,
                        C.[nombre_cuenta] AS nombreCuenta,
                        C.[numero_cuenta] AS numeroCuenta,
                        C.[tipo_cuenta] AS tipoCuenta,
                        C.[nombre_banco] AS nombreBanco,
                        P.[fecha_creacion] AS fechaUltimoPedido
                    FROM Clientes C JOIN Peticiones P
                        ON C.[id_cliente] = P.[cliente_id]
                    WHERE C.[id_cliente] = @ID
                `)

        // Valida si la consulta tiene datos
        if (result.recordset === 0) {
            return null
        }

        return {
            data: result.recordset.map(({fechaUltimoPedido, ...rest }) => ({
                ...rest,
                fechaUltimoPedido: DateConverter(fechaUltimoPedido)
            }))
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTES, typeError.CLIENTES.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassisId/GetChassisId', error);
        throw new Error('Ha ocurrido un error al obtener la información del usuario solicitado');
    }
}