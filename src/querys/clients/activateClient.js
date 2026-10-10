import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';


// Activa/Desactiva un cliente en el sistema
export const ActivateClient = async (client) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, client.id_cliente)
            .input("Active", sql.Bit, client.active)
            .query(`
                    UPDATE [Clientes]
                        SET [active] = @Active,
                            [fecha_modificacion] = GETDATE()
                    WHERE [id_cliente] = @ID
                `);

        // Valida que se haya hecho la activado/desactivado el cliente
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.PATCH);
        HandleError(code, error.message, 'querys/clients/activateClient/ActivateClient', error);
        throw new Error(
            client.active ? 'Ha ocurrido un error al habilitar el cliente' : 'Ha ocurrido un error al deshabilitar el cliente'
        );
    }
}