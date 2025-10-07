import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';

/*
 * Elimina un cabezal del sistema logicamente
 * Desactiva el cabezal para conservar la integridad de los datos
*/
export const DeleteTruckHead = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`UPDATE [Cabezal]
                        SET [active] = 0
                    WHERE [id_cabezal] = @Id`);

        // Valida si desactivo el chasis
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.DELETE);
        HandleError(code, error.message, 'querys/deleteTruckHead/DeleteTruckHead', error);
        throw new Error('No se pudo eliminar el cabezal');
    }
}
