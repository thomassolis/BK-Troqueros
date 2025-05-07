import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza el status del cabezal
export const UpdateStatusTruckHead = async (truckHead) => {
    let transaction = null
    try {
        // Valida que furgon sea undefined
        if (!truckHead) {
            return null
        }

        transaction = new sql.Transaction(pool) // Instancia un objeto transactio

        await transaction.begin() // Comienza la transaction

        const result = await transaction.request()
            .input("ID", sql.VarChar, truckHead.id)
            .input("Status", sql.VarChar, truckHead.status)
            .query(`
                    UPDATE Cabezal
                        SET status = @Status
                    WHERE id_cabezal = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            transaction.commit()
            return true
        }

        transaction.rollback()
        return false
    } catch (error) {
        // En caso de error revierte la transaction
        if (transaction) {
            transaction.rollback()
            return false
        }

        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PATCH);
        HandleError(code, error.message, 'querys/TruckVan/updateStatus/UpdateStatusTruckHead', error);
    }
}