import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';

//Actualiza el número de intentos por parte del usuario
export const UpdateIntents = async (email, numIntentos, tableName) => {
    try {
        await pool.request()
        .input("Email", sql.VarChar, email)
        .query(`UPDATE [Troqueros].[dbo].[${tableName}] 
                SET 
                    [max_intento] = ${numIntentos}
                WHERE 
                    [email] = @Email`);
    } catch (error) {
        HandleError(v1(), error.message, 'querys/login/updateIntents/UpdateIntents', error, 'user');
        throw new Error(`Error al actualizar los intentos del usuario ${user}`);
    }    
}