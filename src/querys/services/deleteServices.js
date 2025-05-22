import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Elimina un servicio del sistema
export const DeleteServices = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.Int, id)
            .query(`
                    DELETE [Servicios_datos]
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
        throw new Error('Ha ocurrido un error al eliminar los datos del servicio');
    }
}