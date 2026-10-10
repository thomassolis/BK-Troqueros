import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';

// Verifica si el RUC del cliente ya está registrado en el sistema
export const ValidateRUC_Client = async (RUC) => {
    let client = null;
    try {
        // Valida si el RUC es undefined
        if (!RUC) {
            return null;
        }

        client = await pool.connect();
        const query = `
            SELECT 1
            FROM Clientes
            WHERE ruc_empresa = $1
        `;
        const result = await client.query(query, [RUC]);

        // Valida si la consulta tiene datos
        if (result.rowCount > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.POST);
        HandleError(code, error.message, 'querys/Clients/validateRUC/ValidateRUC_Client', error);
        throw new Error('Ha ocurrido un error al crear al cliente');
    } finally {
        if (client) {
            client.release();
        }
    }
}