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

        // Valida si el error ha sido por primary key o unique key
        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo actualizar el servicio, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('UQ_')) {
                MyThrow.message = 'El nombre del servicio ya se encuentra en el sistema, favor de verificar la información a actualizar';
            } else {
                MyThrow.message = 'Ha ocurrido un error al actualizar la información del servicio';
            }

            HandleError(code, error.message, 'querys/services/updateServicesInfo/UpdateDataServices', error);
            throw MyThrow;
        }

        HandleError(code, error.message, 'querys/services/updateServicesInfo/UpdateDataServices', error);
        throw new Error('Ha ocurrido un error al actualizar la información del servicio');
    }
}