import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el status del chasis
export const UpdateStatusChassis= async (chassis) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, chassis.id)
            .input("Status", sql.VarChar, chassis.status)
            .query(`
                    UPDATE Chasis
                        SET status = @Status,
                            fecha_modificación = GETDATE()
                    WHERE id_chasis = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PATCH);
        HandleError(code, error.message, 'querys/Chassis/updateStatus/UpdateStatusChassis', error);
        throw new Error('Ha ocurrido un error al actualizar el status del chasis');        
    }
}