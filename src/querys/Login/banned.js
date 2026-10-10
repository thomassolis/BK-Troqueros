import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Banea al usuario
export const Banned = async (email, tableName) => {
    try {
        //Actualiza los datos del usuario que ha sido baneado
        await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`UPDATE [${tableName}] 
                        SET 
                            [suspendido] = 1,
                            [fecha_suspension] = DATEADD(MINUTE, 10, GETDATE())
                        WHERE 
                            [email] = @Email`);

    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoAutenticado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/banned/Banned', error);
        throw new Error(`No se pudo actualizar la informacion del usuario ${email}`);
    }
}

//Desbanea al usuario
export const UnBan = async (email) => {
    try {
        await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`UPDATE [Usuarios] 
                        SET 
                            [suspendido] = 0,
                            [fecha_suspension] = NULL,
                            [max_intento] = 0
                        WHERE 
                            [email] = @Email`);
    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoAutenticado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/banned/UnBan', error);
        throw new Error(`No se pudo actualizar la informacion del usuario ${email}`);
    }
}
