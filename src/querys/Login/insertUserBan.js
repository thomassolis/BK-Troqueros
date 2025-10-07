import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';

//Inserta al usuario no registrado
export const InsertUserBan = async (email) => {
    try {
        await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`INSERT INTO [Usuarios_Baneados] (email, max_intento, user_ban)
                    VALUES (@Email, 1, 1)`);

    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoEncontrado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/insertUserBan/InsertUserBan', error);
        throw new Error('No se ha podido insertar el usuario en usuario baneados');
    }
}