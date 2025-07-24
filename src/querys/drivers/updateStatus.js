import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el status del conductor
export const UpdateStatusDriver = async (driver) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, driver.id_conductor)
            .input("Status", sql.VarChar, driver.status)
            .query(`
                    UPDATE [Conductores]
                        SET [status] = @Status,
                            [fecha_modificación] = GETDATE()
                    WHERE [id_conductor] = @ID
                `)

        // Valida que se haya hecho la actualización
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.PATCH);
        HandleError(code, error.message, 'querys/drivers/updateStatus/UpdateStatusDriver', error);
        throw new Error('Ha ocurrido un error al actualizar el status del conductor');
    }
}