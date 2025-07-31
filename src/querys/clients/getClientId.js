import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from 'mssql';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';

// Obtiene la informacipon de un cliente
export const GetClientById = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, id)
            .query(`
                    SELECT
                        [id_cliente],
                        [nombre],
                        [ruc_empresa] AS ruc,
                        [DV] as dv,
                        [direccion],
                        [nombre_persona_contacto] AS nombrePersonaContacto,
                        [telefono_persona_contacto] AS telPersonaContacto,
                        [email_persona_contacto] AS emailPersonaContacto,
                        [nombre_cuenta] AS nombreCuenta,
                        [numero_cuenta] AS numeroCuenta,
                        [tipo_cuenta] AS tipoCuenta,
                        [nombre_banco] AS nombreBanco,
                        [copia_cedula_representante_legal] AS cedRepresentanteLegal,
                        [copia_aviso_operaciones] AS avisoOperaciones,
                        [cedula_persona_natural] AS cedPersonaNatural,
                        [fecha_creacion] AS fechaUltimoPedido
                    FROM Clientes
                    WHERE [id_cliente] = @ID
                `)

        // Valida si la consulta tiene datos
        if (result.recordset === 0) {
            return null
        }

        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassisId/GetChassisId', error);
        throw new Error('Ha ocurrido un error al obtener la información del usuario solicitado');
    }
}