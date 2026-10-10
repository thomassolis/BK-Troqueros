import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { modules } from '../../dictionary/modules.js'
import { typeError } from '../../dictionary/typeError.js'
import { GenerateCodeError } from '../../utils/getCodeError.js'
import { HandleError } from '../../utils/HandleError.js';


export const DeleteServiceRequest = async (idService) => {
    let transaction = null;
    try {
        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        await transaction.begin() // Iniciamos la transaction
        const request = await transaction.request();

        const check = await request
            .input('IDServicio', sql.Int, idService)
            .query(`SELECT 1 AS existe FROM [Pedido_Servicio] WHERE [id_Pedido_Servicio] = @IDServicio`);

        // Valida si existe el servicio
        if (check.recordset.length === 0) {
            await transaction.rollback();
            return false;
        }

        //Borra los costos de los servicios
        await request
            .input('IDServicio0', sql.Int, idService)
            .query(`DELETE FROM [pedido_servicio_precios_totales] WHERE [id_Pedido_Servicio] = @IDServicio`);

        // Borra costos extras si existen
        await request
            .input('IDServicio1', sql.Int, idService)
            .query(`DELETE FROM [Costos_Extras] WHERE [id_Pedido_Servicio] = @IDServicio`);

        // Borra el servicio
        const result = await request
            .input('IDServicio2', sql.Int, idService)
            .query(`DELETE FROM [Pedido_Servicio] WHERE [id_Pedido_Servicio] = @IDServicio`);

        // Valida que se haya eliminado el servicio
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
        throw new Error('Ha ocurrido un error al eliminar el servicio');
    }
}