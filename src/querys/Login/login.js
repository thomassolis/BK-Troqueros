import bcrypt from 'bcryptjs';
import { pool, ConnectDB } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';

export const ValidateUser = async (email, pass) => {
    try {
        const result = await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`SELECT 
                    U.[id_usuario], 
                    U.[nombre], 
                    U.[apellido], 
                    U.[email], 
                    U.[contraseña],
                    UR.[id_rol],
                    P.[crear_registros],
                    P.[editar_modulos],
                    P.[eliminar_modulos],
                    P.[ver_registros],
                    P.[actualizar_registros]
                    FROM 
                        [Troqueros].[dbo].[Usuarios] U
                        JOIN
                        [Troqueros].[dbo].[Usuarios_Roles] UR
                        ON U.[id_usuario] = UR.[id_usuario]
                        JOIN
                        [Troqueros].[dbo].[Permisos] P
                        ON UR.[id_rol] = P.[id_rol]
                        WHERE U.[email] = @Email`);

        const user = result.recordset[0];
        
        if (!user) {
            throw new Error('EL usuario no existe.');
        }

        await VerifyPassword(pass, user.contraseña)
        
        return {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol: user.id_rol,
            crear_registros: user.crear_registros,
            editar_modulos: user.editar_modulos,
            eliminar_modulos: user.eliminar_modulos,
            actualizar_registros: user.actualizar_registros,
            ver_registros: user.ver_registros,
        };

    } 
    catch (error) {
        console.error('Error al validar el usuario:', error.message);
        HandleError(error.message, 'querys/login', error, 'user');
    }
};

const VerifyPassword = async (pass, hash) => {
    const passwordMatch = await bcrypt.compare(pass, hash);

    if (!passwordMatch) {
        throw new Error('Credenciales incorrectas');
    }
};