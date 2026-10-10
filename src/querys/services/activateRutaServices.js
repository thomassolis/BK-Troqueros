import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


export const ActivateRutaService = async (service) => {
    try {        
        const result = await pool.request()
            .input("ID", sql.Int, service.id_servicio_datos)
            .input("Active", sql.Bit, service.active)
            .query(`
                    UPDATE [Servicios_datos]
                        SET [active] = @Active
                    WHERE [id_servicio_datos] = @ID
                `);
        
        // Valida si se habilitó o deshabilitó el servicio
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PATCH);
        HandleError(code, error.message, 'querys/services/activateRutaServices/ActivateRutaService', error);
        throw new Error(
            service.active
                ? 'Ha ocurrido un error al habilitar la ruta del servicio'
                : 'Ha ocurrido un error al deshabilitar la ruta del servicio'
        );
    }
}