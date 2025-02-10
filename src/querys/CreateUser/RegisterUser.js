import sql from 'mssql';
import { pool, ConnectDB } from '../../db/db.js';
import { HandleError } from '../../utils/HandleError.js';

export const CreateUser = async (data) => {
    try {
        const result = await pool.request()
            .input("Nombre", sql.VarChar, data.nombre)
            .input("Apellido", sql.VarChar, data.apellido)
            .input("Email", sql.VarChar, data.email)
            .input("Pass", sql.VarChar, data.pass)
            .query(`INSERT INTO [Troqueros].[dbo].[Usuarios] (nombre, apellido, email, contraseña) 
                OUTPUT INSERTED.id_usuario
                VALUES (@Nombre, @Apellido, @Email, @Pass)`);

                
        //Valida que al momento de insertar el usuario este retorne el Id del usuario registrado
        const idUser = Number(result.recordset[0].id_usuario, 10);
        
        if (!idUser){
            return false;
        }

        const insertedRole = await InsertRolUser(idUser, data.rol);

        return insertedRole;
    } catch (error) {
        HandleError(error.message, 'CreateUser', error, 'user');
    }
}

export const ValidateEmail = async (email) => {
    try {
        const result = await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`SELECT email FROM [Troqueros].[dbo].[Usuarios] WHERE [email] = @Email`);

        return result.recordset[0];
        
    } catch (error) {
        HandleError(error.message, 'ValidateEmail', error, 'user');
    }
}

const InsertRolUser = async (idUsuario, idRol) => {
    try {
        const result = await pool.request()
            .input("idUsuario", sql.Int, idUsuario)
            .input("idRol", sql.Char(3), idRol)
            .query(`INSERT INTO [Troqueros].[dbo].[Usuarios_Roles] (id_usuario, id_rol) VALUES (@idUsuario, @idRol)`);

        return result.rowsAffected;
    } catch (error) {
        console.log(error);
        HandleError(error.message, 'InsertRolUser', error, 'user');
    }
}