import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el status del cabezal
export const UpdateStatusTruckHead = async (truckHead) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, truckHead.id)
            .input("Status", sql.VarChar, truckHead.status)
            .query(`
                    UPDATE Cabezal
                        SET status = @Status,
                            fecha_modificacion = GETDATE()
                    WHERE id_cabezal = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true
        }

        return false
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PATCH);
        HandleError(code, error.message, 'querys/TruckHead/updateStatus/UpdateStatusTruckHead', error);
        throw new Error('Ha ocurrido un error al actualizar el status del cabezal');
    }
}