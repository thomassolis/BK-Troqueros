import sql from 'mssql';
import { pool, ConnectDB } from '../../db/db.js';
import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const CreateUser = async (data) => {
    const transaction = new sql.Transaction(pool);
    try {
        // Comienza la transacción
        await transaction.begin();

        const result = await transaction.request()
            .input("Nombre", sql.VarChar, data.nombre)
            .input("Apellido", sql.VarChar, data.apellido)
            .input("Email", sql.VarChar, data.email)
            .input("Pass", sql.VarChar, data.pass)
            .query(`INSERT INTO [Troqueros].[dbo].[Usuarios] (nombre, apellido, email, contraseña) 
                OUTPUT INSERTED.id_usuario
                VALUES (@Nombre, @Apellido, @Email, @Pass)`);

                
        //Valida que al momento de insertar el usuario este retorne el Id del usuario registrado
        const idUser = Number(result.recordset[0].id_usuario, 10);
        
        //valida que el usuario se haya insertado correctamente
        if (!idUser){
            await transaction.rollback();
            return false;
        }

        const insertedRole = await InsertRolUser(idUser, data.rol, transaction); //inserta el rol

        //valida que el rol se haya insertado correctamente
        if (!insertedRole) {
            await transaction.rollback();
            return false;
        }

        // Si todo está bien, se realiza un commit y se hace el insert
        await transaction.commit();

        return insertedRole;
    } catch (error) {
        console.error(error)
        await transaction.rollback();

        const code = GenerateCodeError(modules.USUARIOS, typeError.usuarioNoCreado);
        HandleError(code, error.message, 'query/CreateUser/CreateUser', error);
        throw new Error('Error al crear el usuario');
    }
}

export const ValidateEmail = async (email) => {
    try {
        const result = await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`SELECT email FROM [Troqueros].[dbo].[Usuarios] WHERE [email] = @Email`);

        return result.recordset[0];
        
    } catch (error) {
        console.error(error);
        const code = GenerateCodeError(modules.USUARIOS, typeError.validarCorreo);
        HandleError(code, error.message, 'query/CreateUser/ValidateEmail', error);
        throw new Error(`Error al validar el correo ${email}`);
    }
}

const InsertRolUser = async (idUsuario, idRol, transaction) => {
    try {
        const result = await transaction.request()
            .input("idUsuario", sql.Int, idUsuario)
            .input("idRol", sql.Char(3), idRol)
            .query(`INSERT INTO [Troqueros].[dbo].[Usuarios_Roles] (id_usuario, id_rol) VALUES (@idUsuario, @idRol)`);

        return result.rowsAffected;
    } catch (error) {
        const code = GenerateCodeError(modules.USUARIOS, typeError.insertarRol);
        HandleError(code, error.message, 'query/CreateUser/InsertRolUser', error);
        throw new Error(`Error al insertar el rol del usaurio ${idUsuario}`);
    }
}