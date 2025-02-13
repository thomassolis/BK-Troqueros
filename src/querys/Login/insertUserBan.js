import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';

//Inserta al usuario no registrado
export const InsertUserBan = async (email) => {
    try {
        await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`INSERT INTO [Troqueros].[dbo].[Usuarios_Baneados] (email, max_intento, user_ban)
                    VALUES (@Email, 1, 1)`);

    } catch (error) {
        HandleError(v1(), error.message, 'querys/login/insertUserBan/InsertUserBan', error, 'user');
        throw new Error('Error interno del servidor');
    }
}