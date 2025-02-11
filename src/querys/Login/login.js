import bcrypt from 'bcryptjs';
import { pool, ConnectDB } from '../../db/db.js';
import sql from 'mssql';
import { HandleError } from '../../utils/HandleError.js';
import { v1 } from 'uuid';

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
                    UR.[id_rol]
                    FROM 
                        [Troqueros].[dbo].[Usuarios] U
                        JOIN
                        [Troqueros].[dbo].[Usuarios_Roles] UR
                        ON U.[id_usuario] = UR.[id_usuario]
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
        };

    } 
    catch (error) {
        HandleError(v1, error.message, 'querys/login', error, 'user');
        throw new Error('Error interno del servidor');
    }
};

const VerifyPassword = async (pass, hash) => {
    const passwordMatch = await bcrypt.compare(pass, hash);

    if (!passwordMatch) {
        throw new Error('Credenciales incorrectas');
    }
};