import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

/*
 * Elimina un chasis del sistema logicamente
 * Desactiva el chasis para conservar la integridad de los datos
*/
export const DeleteChassis = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`UPDATE [Chasis]
                        SET [active] = 0
                    WHERE id_chasis = @Id`);

        // Valida si desactivo el chasis
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.DELETE);
        HandleError(code, error.message, 'querys/deleteChassis/DeleteChassis', error);
        throw new Error('No se pudo eliminar el chasis');
    }
}

