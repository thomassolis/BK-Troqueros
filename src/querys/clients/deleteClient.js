import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

/*
 * Desactiva un cliente para mantener la integridad de los datos
 * El cliente puede estar relacionados con otros modulos
*/
export const DeleteClient = async (id) => {
    try {        
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    UPDATE [Clientes]
                        SET [active] = 0
                    WHERE id_cliente = @Id
                `);

        // Valida si se ha eliminado el cliente logicamente
        if ( result.rowsAffected > 0) {
            return true
        }

        return false
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.DELETE);
        HandleError(code, error.message, 'querys/clients/deleteClient/DeleteClient', error);
        throw new Error('Ha ocurrido un error al eliminar el cliente');
    }
}
