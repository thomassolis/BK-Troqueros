import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

/*
 * Elimina un furgon del sistema logicamente
 * Desactiva el furgon para conservar la integridad de los datos
*/
export const DeleteTruckVan = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.Char(7), id)
            .query(`UPDATE [Furgon]
                        SET [active] = 0
                    WHERE [id_furgon] = @Id`);

        // Valida si desactivo el chasis
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.DELETE);
        HandleError(code, error.message, 'querys/deleteTruckVan/DeleteTruckVan', error);
        throw new Error('No se pudo eliminar el furgon');
    }
}

