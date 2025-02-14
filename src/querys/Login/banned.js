import { pool } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';

//Banea al usuario
export const Banned = async (email, tableName) => {
    try {
        //Actualiza los datos del usuario que ha sido baneado
        await pool.request()
                .input("Email", sql.VarChar, email)
                .query(`UPDATE [Troqueros].[dbo].[${tableName}] 
                        SET 
                            [suspendido] = 1,
                            [fecha_suspencion] = DATEADD(MINUTE, 10, GETDATE())
                        WHERE 
                            [email] = @Email`);
        
    } catch (error) {
        HandleError(v1(), error.message, 'querys/login/banned/Banned', error, 'user');
        throw new Error('Error en la consulta de la base de datos');
    }
}

//Desbanea al usuario
export const UnBan = async (email) => {
    try {
        await pool.request()
                .input("Email", sql.VarChar, email)
                .query(`UPDATE [Troqueros].[dbo].[Usuarios] 
                        SET 
                            [suspendido] = 0,
                            [fecha_suspencion] = NULL,
                            [max_intento] = 0
                        WHERE 
                            [email] = @Email`);
    } catch (error) {
        HandleError(v1(), error.message, 'querys/login/banned/UnBan', error, 'user');
        throw new Error('Error en la consulta de la base de datos');
    }
}
