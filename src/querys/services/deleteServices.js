import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Desactiva un servicio del sistema
/*
 * Desactiva un servicio en lugar de eliminarlo físicamente.
 * Esto se por la integridad de los datos que esten relacionados con este servicio.
*/
export const DeleteServices = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.Int, id)
            .query(`
                    UPDATE [Troqueros].[dbo].[Servicios]
                        SET [active] = 0
                    WHERE [id_servicio] = @ID
                `)

        // Valida que se haya hecho la eliminación
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'querys/services/deleteServices/DeleteServices', error);
        throw new Error('Ha ocurrido un error al eliminar el servicio');
    }
}


// Desactiva la ruta del servicio
/*
 * Desactiva la ruta del servicio en lugar de eliminarlo físicamente.
 * Esto se hace por la integridad de los datos, y por que estan relacionados con otros modulos.
*/
export const DeleteRutaServices = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.Int, id)
            .query(`
                    UPDATE [Troqueros].[dbo].[Servicios_datos]
                        SET [active] = 0
                    WHERE [id_servicio_datos] = @ID
                `)

        // Valida que se haya hecho la eliminación
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'querys/services/deleteServices/DeleteServices', error);
        throw new Error('Ha ocurrido un error al eliminar la ruta del servicio');
    }
}
