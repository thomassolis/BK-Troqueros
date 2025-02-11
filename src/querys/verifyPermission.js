import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../db/db.js';
import dotenv from 'dotenv';

dotenv.config();

export const VerifyPermission = async (module, action, rol) => {
    try {
        const result = await pool.request()
            .input("Module", sql.VarChar, module)
            .input("Rol", sql.Char(3), rol)
            .query(`SELECT
				P.[${action}]
                FROM 
                [Troqueros].[dbo].[Permisos] P 
                JOIN 
                [Troqueros].[dbo].[Modulos] M
                ON
                P.[id_permiso] = M.[id_permiso]
                WHERE P.[id_rol] = @Rol AND M.[tabla_relacionada] = @Module AND P.[${action}] = 1`);

        return result.recordset[0];
    } catch (error) {
        HandleError(v1, error.message, 'querys/verifyPermission/VerifyPermission', error, 'user');
        throw new Error('Error... No se puso hacer la consulta a la base de datos');
    }
}
