import sql from 'mssql';
import { pool } from '../../db/db';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


// Actualiza la información de una petición
export const UpdateRequest = async (request) => {
    let transaction = null
    try {
        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction
        await transaction.begin(); // Iniciamos la transaction

        //cliente_id, proveedor_id, precio_total, fecha_salida, fecha_modificacion
        let monto = 0; // Declaramos monto con valor inicial de 0

        // Suma las tarifas de los servicios
        // Suma los costos extras de los servicios
        // Obtiene el monto total de los servicios solicitados
        for (const item of request.servicios) {
            monto += (item.tarifa ? item.tarifa : 0) + (item.precio ? item.precio : 0);
        }

        const result = await transaction.request()
            .input("ID", sql.VarChar, request.id_peticion)
            .input("Cliente", sql.VarChar, request.id_cliente)
            .input("Proveedor", sql.VarChar, request.id_proveedor)
            .input("Monto", sql.Float, monto)
            .input("FechaSalida", sql.Date, request.fecha_salida)
            .query(`
                    UPDATE [Troqueros].[dbo].[Peticiones] ([cliente_id], [proveedor_id], [precio_total], [fecha_salida])
                        SET [cliente_id] = @Cliente,
                            [proveedor_id] = @Proveedor,
                            [precio_total] = @Monto,
                            [fecha_salida] = @FechaSalida,
                            [fecha_modificación] = GETDATE()
                    WHERE [id_peticion] = @ID
                `);

        // Valida que se haya actualizado la petición
        if (result.rowsAffected > 0) {
            
        }
    } catch (error) {
        // En caso de error, revierte la transaction
        if (transaction) {
            transaction.rollback();
        }
        
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'querys/requests/updateRequest/UpdateRequest', error);
        throw new Error('Ha ocurrido un error al actualizar la información de la petición');        
    }
}