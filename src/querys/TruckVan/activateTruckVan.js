import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Habilita el furgon en el sistema
export const ActivateTruckVan = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, id)
            .query(`
                    UPDATE [Troqueros].[dbo].[Furgon]
                        SET [active] = 1,
                            [fecha_modificación] = GETDATE()
                    WHERE [id_furgon] = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PATCH);
        HandleError(code, error.message, 'querys/TruckVan/activateTruckVan/ActivateTruckVan', error);
        throw new Error('Ha ocurrido un error al habilitar el furgon');        
    }
}