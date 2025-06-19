import sql from 'mssql';
import { pool } from '../../db/db';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


// Actualiza la información de una petición
export const UpdateRequest = async () => {
    let transaction = null
    try {
        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction
        await transaction.begin(); // Iniciamos la transaction
    } catch (error) {
        // En caso de error, revierte la transaction
        if (transaction) {
            transaction.rollback();
        }
        
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PATCH);
        HandleError(code, error.message, 'querys/requests/updateRequest/UpdateRequest', error);
        throw new Error('Ha ocurrido un error al actualizar la información de la petición');        
    }
}