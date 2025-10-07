import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Actualiza el número de intentos por parte del usuario
export const UpdateIntents = async (email) => {
    try {
        await pool.request()
        .input("Email", sql.VarChar, email)
        .query(`UPDATE [Usuarios] 
                SET 
                    [max_intento] = 0
                WHERE 
                    [email] = @Email`);
    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoAutenticado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/updateIntents/UpdateIntents', error);
        throw new Error(`Error al actualizar los intentos del usuario ${email}`);
    }    
}