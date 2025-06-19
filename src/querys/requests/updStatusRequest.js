import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el estado de la petición
export const UpdateStatusRequest = async (request) => {
    try {
        let query = `
            UPDATE [Troqueros].[dbo].[Peticiones]
                SET [status] = @Status,
                    [fecha_modificación] = GETDATE()

        `;

        if (request.status === 'Completado') {
            query += `,[fecha_finalizacion] = GETDATE() \n`
        }

        query += ` WHERE [id_peticion] = @ID`

        const result = await pool.request()
            .input("ID", sql.VarChar, request.id_peticion)
            .input("Status", sql.VarChar, request.status)
            .query(query);

        // Validamos que se haya hecho la actualización del estado de la petición
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PATCH);
        HandleError(code, error.message, 'querys/requests/insertRequests/InsertNewRequest', error);
        throw new Error('Ha ocurrido un error al crear una nueva petición');
    }
}