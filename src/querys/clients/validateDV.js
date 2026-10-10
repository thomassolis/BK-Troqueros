import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';

// Verifica si el DV del cliente ya está registrado en el sistema
export const ValidateDV_Client = async (idClient, DV) => {
    let client = null;
    try {
        // Valida si el DV es undefined
        if (!DV) {
            return null;
        }

        client = await pool.connect();
        
        let query = `
            SELECT 1 FROM CLIENTES
            WHERE DV = $1
        `;
        const values = [DV];

        // Valida que idCliente no sea undefined
        if (idClient) {
            query += ` AND id_cliente <> $2`;
            values.push(idClient);
        }

        const result = await client.query(query, values);

        // Valida si la consulta tiene datos
        if (result.rowCount > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.POST);
        HandleError(code, error.message, 'querys/Clients/validateDV/ValidateDV_Client', error);
        throw new Error('Ha ocurrido un error al crear al cliente');
    } finally {
        if (client) {
            client.release();
        }
    }
}