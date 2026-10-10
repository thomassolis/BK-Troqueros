import bcrypt from 'bcryptjs';
import { pool, ConnectDB } from '../../db/db.js';
import sql from '../../db/db.js';
import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Valida que el usuario exista
export const ValidateUser = async (email) => {
    try {
        // 1. Buscar en Usuarios
        const userRes = await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`
                SELECT 
                    U.id_usuario, 
                    U.nombre, 
                    U.apellido, 
                    U.email, 
                    U.contrasena, 
                    UR.id_rol, 
                    U.suspendido, 
                    U.fecha_suspension, 
                    U.max_intento,
                    NULL AS user_ban
                FROM Usuarios U
                LEFT JOIN Usuarios_Roles UR ON U.id_usuario = UR.id_usuario
                WHERE U.email = @Email
            `);

        if (userRes.recordset && userRes.recordset.length > 0) {
            return userRes.recordset[0];
        }

        // 2. Si no existe en Usuarios, buscar en Usuarios_Baneados
        const banRes = await pool.request()
            .input("Email", sql.VarChar, email)
            .query(`
                SELECT 
                    email, 
                    suspendido, 
                    fecha_suspension, 
                    max_intento, 
                    user_ban
                FROM Usuarios_Baneados
                WHERE email = @Email
            `);

        if (banRes.recordset && banRes.recordset.length > 0) {
            return banRes.recordset[0];
        }

        return null;
    }
    catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoEncontrado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/ValidateUser', error, 'Usuario no autenticado');
        throw new Error('Error interno del servidor');
    }
};

//Verifica que la contraseña ingresada sea correcta
export const VerifyPassword = async (pass, user) => {
    const userPass = user.contrasena || user.contraseña;
    if (!userPass) return undefined;

    const passwordMatch = await bcrypt.compare(pass, userPass);

    if (!passwordMatch) {
        return undefined;
    }

    return {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.id_rol,
    };
};