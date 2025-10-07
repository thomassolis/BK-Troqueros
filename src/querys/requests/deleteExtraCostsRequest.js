import sql from 'mssql';
import { pool } from '../../db/db.js';
import { modules } from '../../dictionary/modules.js'
import { typeError } from '../../dictionary/typeError.js'
import { GenerateCodeError } from '../../utils/getCodeError.js'
import { HandleError } from '../../utils/HandleError.js';


export const DeleteExtraCostsRequest = async (idExtraCost) => {
    let transaction = null;
    try {
        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction
        await transaction.begin(); // Iniciamos la transaction

        const result = await transaction.request()
            .input("IdExtraCost", sql.Int, idExtraCost)
            .query(`
                    DELETE [Costos_Extras] WHERE [id_Costos_Extras] = @IdExtraCost
                `);

        // Valida que se haya hecho la eliminación del costo extra
        if (result.rowsAffected > 0) {
            await transaction.commit();
            return true;
        }

        await transaction.rollback();
        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.DELETE);
        HandleError(code, error.message, 'querys/requests/deleteServiceRequest/DeleteServiceRequest', error);

        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback();
        }
        throw new Error('Ha ocurrido un error al eliminar el costos extra del servicio');    
    }
}