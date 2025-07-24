import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';

// Habilita/Deshabilita el conductor en el sistema
export const ActivateDriver = async (driver) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, driver.id_conductor)
            .input("Active", sql.Bit, driver.active)
            .query(`
                    UPDATE [Troqueros].[dbo].[Conductores]
                        SET [active] = @Active,
                            [fecha_modificación] = GETDATE()
                    WHERE [id_conductor] = @ID
                `);

        // Valida que se haya habilitado/deshabilitado el conductor
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, 'NH');
        HandleError(code, error.message, 'querys/drivers/activateDriver/ActivateDriver', error);
        throw new Error(
            driver.active ? 'Ha ocurrido un error al habilitar el conductor' : 'Ha ocurrido un error al deshabilitar el conductor'
        );
    }
}