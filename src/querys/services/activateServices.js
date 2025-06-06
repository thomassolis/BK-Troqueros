import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


export const ActivateService = async (service) => {
    try {
        const result = await pool.request()
            .input("ID", sql.Int, service.id_servicio)
            .input("Active", sql.Bit, service.active)
            .query(`
                    UPDATE [Troqueros].[dbo].[Servicios]
                        SET [active] = @Active
                    WHERE [id_servicio] = @ID
                `);
        
        // Valida si se habilitó o deshabilitó el servicio
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PATCH);
        HandleError(code, error.message, 'querys/services/activateServices/ActivateService', error);
        throw new Error(
            service.active
                ? 'Ha ocurrido un error al habilitar el servicio'
                : 'Ha ocurrido un error al deshabilitar el servicio'
        );
    }
}