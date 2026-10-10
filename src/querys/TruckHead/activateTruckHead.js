import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Habilita el cabezal en el sistema
export const ActivateTruckHead = async (truckHead) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, truckHead.id_cabezal)
            .input("Active", sql.Bit, truckHead.active)
            .query(`
                    UPDATE [Cabezal]
                        SET [active] = @Active,
                            [fecha_modificacion] = GETDATE()
                    WHERE [id_cabezal] = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PATCH);
        HandleError(code, error.message, 'querys/TruckHead/activateTruckHead/ActivateTruckHead', error);
        throw new Error(
            truckHead.active ? 'Ha ocurrido un error al habilitar el cabezal' : 'Ha ocurrido un error al deshabilitar el cabezal'
        );
    }
}