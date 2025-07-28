import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import sql from 'mssql';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';


// Verifica si el DV del cliente ya está registrado en el sistema
export const ValidateDV_Client = async (DV) => {
    try {
        // Valida si el DV es undefined
        if (!DV) {
            return null
        }

        const result = await pool.request()
            .input("DV", sql.Int, DV)
            .query(`
                    SELECT 1
                    FROM Clientes
                    WHERE DV = @DV
                `)

        // Valida si la consulta tiene datos
        if (result.recordset.length > 0) {
            return true
        }

        return false
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.POST);
        HandleError(code, error.message, 'querys/Clients/insertClient/InsertClient', error);
        throw new Error('Ha ocurrido un error al crear al cliente');
    }
}