import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Desactiva un servicio del sistema
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
        console.log(error)
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'querys/services/deleteServices/DeleteServices', error);
        throw new Error('Ha ocurrido un error al eliminar el servicio');
    }
}


// Desactiva la ruta del servicio
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
        console.log(error)
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'querys/services/deleteServices/DeleteServices', error);
        throw new Error('Ha ocurrido un error al eliminar la ruta del servicio');
    }
}
