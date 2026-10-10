import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Habilita/Deshabilita el chasis en el sistema
export const ActivateChassis = async (chassis) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, chassis.id_chasis)
            .input("Active", sql.Bit, chassis.active)
            .query(`
                    UPDATE [Chasis]
                        SET [active] = @Active,
                            [fecha_modificacion] = GETDATE()
                    WHERE [id_chasis] = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PATCH);
        HandleError(code, error.message, 'querys/Chassis/activateChassis/ActivateChassis', error);
        throw new Error(
            chassis.active ? 'Ha ocurrido un error al habilitar el chasis' : 'Ha ocurrido un error al deshabilitar el chasis');
    }
}