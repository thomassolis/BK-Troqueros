import { HandleError } from '../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../db/db.js';
import dotenv from 'dotenv';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

dotenv.config();

export const VerifyPermission = async (module, action, rol) => {
    try {
        const result = await pool.request()
            .input("Module", sql.VarChar, module)
            .input("Rol", sql.Char(3), rol)
            .query(`SELECT
				P.[${action}]
                FROM 
                [Permisos] P 
                JOIN 
                [Modulos] M
                ON
                P.[id_permiso] = M.[id_permiso]
                WHERE P.[id_rol] = @Rol AND M.[tabla_relacionada] = @Module AND P.[${action}] = 1`);

        return result.recordset[0];
    } catch (error) {
        module = 'E' + module.substring(0, 2).toUpperCase();
        
        const code = GenerateCodeError(module, typeError.permisoDenegado);
        HandleError(code, error.message, 'querys/verifyPermission/VerifyPermission', error);
        throw new Error('Ha ocurrido un error al validar los permisos');
    }
}