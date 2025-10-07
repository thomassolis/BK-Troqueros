import bcrypt from 'bcryptjs';
import { pool, ConnectDB } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Valida que el usuario exista
export const ValidateUser = async (email) => {
    try {
        const result = await pool.request()
                            .input("Email", sql.VarChar, email)
                            .query(`SELECT 
                                        CASE
                                            WHEN EXISTS (SELECT 1 FROM [Usuarios] WHERE email = @Email)
                                            THEN (
                                                SELECT 
                                                    JSON_QUERY(
                                                        CONCAT(
                                                            '{',
                                                                '"id_usuario": "', COALESCE(U.[id_usuario], ''), '", ', 
                                                                '"nombre": "', COALESCE(U.[nombre], ''), '", ', 
                                                                '"apellido": "', COALESCE(U.[apellido], ''), '", ', 
                                                                '"email": "', COALESCE(U.[email], ''), '", ',
                                                                '"contraseña": "', COALESCE(U.[contraseña], ''), '", ',
                                                                '"id_rol": "', COALESCE(UR.[id_rol], ''), '", ',
                                                                '"suspendido": "', COALESCE(U.[suspendido], ''), '", ',
                                                                '"fecha_suspencion": "', COALESCE(U.[fecha_suspencion], NULL), '", ',
                                                                '"max_intento": "', COALESCE(U.[max_intento], ''), '"',
                                                            '}'
                                                        )
                                                    )
                                                FROM [Usuarios] U
                                                JOIN [Usuarios_Roles] UR ON U.[id_usuario] = UR.[id_usuario]
                                                WHERE U.[email] = @Email
                                            )
                                            WHEN EXISTS (SELECT 1 FROM [Usuarios_Baneados] WHERE email = @Email)
                                            THEN (
                                                SELECT
                                                    JSON_QUERY(
                                                        CONCAT(
                                                            '{',
                                                                '"email": "', COALESCE(email, ''), '",',
                                                                '"suspendido": "', COALESCE(suspendido, ''), '",',
                                                                '"fecha_suspencion": "', COALESCE(fecha_suspencion, NULL), '",',
                                                                '"max_intento": "', COALESCE(max_intento, ''), '",',
                                                                '"user_ban": "', COALESCE(user_ban, NULL), '"',
                                                            '}'
                                                        )
                                                    )
                                                FROM [Usuarios_Baneados] WHERE email = @Email
                                            )
                                            ELSE NULL
                                        END AS resultado`);
        
        return JSON.parse(result.recordset[0].resultado);
    } 
    catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoEncontrado); //generar codigo del error
        HandleError(code, error.message, 'querys/login/ValidateUser', error, 'Usuario no auntenticado');
        throw new Error('Error interno del servidor');
    }
};

//Verifica que la contraseña ingresada sea correcta
export const VerifyPassword = async (pass, user) => {
    const passwordMatch = await bcrypt.compare(pass, user.contraseña? user.contraseña: 'dslnljdsnc');

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