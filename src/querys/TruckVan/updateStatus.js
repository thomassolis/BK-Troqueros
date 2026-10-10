import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el status del furgon
export const UpdateStatusTruckVan = async (truckVan) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, truckVan.id)
            .input("Status", sql.VarChar, truckVan.status)
            .query(`
                    UPDATE Furgon
                        SET status = @Status,
                            fecha_modificacion = GETDATE()
                    WHERE id_furgon = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true
        }

        return false
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PATCH);
        HandleError(code, error.message, 'querys/TruckVan/updateStatus/UpdateStatusTruckVan', error);
        throw new Error('Ha ocurrido un error al actualizar el status del furgon');
    }
}