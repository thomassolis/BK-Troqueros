import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el nombre del servicio
export const UpdateDataServices = async (service) => {
    try {
        const result = await pool.request()
            .input("ID", sql.Int, service.id_servicio)
            .input("Nombre", sql.VarChar(30), service.nombre_servicio)
            .query(`
                    UPDATE [Troqueros].[dbo].[Servicios]
                        SET [nombre] = @Nombre
                    WHERE id_servicio = @ID
                `);
            
        // Valida que se haya actualizado la ruta del servicio
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PUT);
        HandleError(code, error.message, 'querys/services/updateServices/UpdateDataServices', error);
        throw new Error('Ha ocurrido un error al actualizar la información del servicio');
    }
}