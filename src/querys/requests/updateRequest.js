import sql from 'mssql';
import { pool } from '../../db/db.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { UpdOrderServiceRequest } from './updateOrderServices.js';
import { InsertOrderServices } from './insertOrderService.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';


// Actualiza la información de una petición
export const UpdateRequest = async (request) => {
    let transaction = null
    try {
        request.hora_salida = GetTime(request.hora_salida); // Obtenemos la hora de salida en formato Time
        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction
        await transaction.begin(); // Iniciamos la transaction

        let monto = 0; // Declaramos monto con valor inicial de 0
        let profit = 0; // Declaramos profit con valor inicial de 0

        // Suma las tarifas de los servicios
        // Obtiene el monto total de los servicios solicitados
        for (const item of request.servicios || []) {
            monto += item.tarifa ? item.tarifa : 0;

            // Suma los precios de los costos extras si existen
            if (Array.isArray(item.costos_extras)) {
                for (const costo of item.costos_extras) {
                    monto += costo.precio ? costo.precio : 0;
                }
            }
        }
        
        for (const item of request.nuevos_servicios || []) {
            monto += (item.tarifa ? item.tarifa : 0);

            // Suma los precios de los costos extras si existen
            if (Array.isArray(item.costos_extras)) {
                for (const costo of item.costos_extras) {
                    monto += (costo.precio ? costo.precio : 0);
                }
            }
        }
        
        // Valida si la petición es por proveedor
        // Calcula el profit
        if (request?.precio_proveedor) {
            profit = request.servicios && request.servicios.length > 0 
                ? (request.servicios[0].tarifa - request.precio_proveedor)
                : (request.nuevos_servicios[0].tarifa - request.precio_proveedor);
        }
        console.log(request)
        const result = await transaction.request()
            .input("ID", sql.VarChar, request.id_peticion)
            .input("Cliente", sql.VarChar, request.id_cliente)
            .input("Proveedor", sql.VarChar, request.id_proveedor)
            .input("Monto", sql.Float, monto)
            .input("PrecioProveedor", sql.Float, request.precio_proveedor)
            .input("Profit", sql.Float, request.profit || 0)
            .input("FechaSalida", sql.Date, request.fecha_salida)
            .input("HoraSalida", sql.Time, request.hora_salida)
            .query(`
                    UPDATE [Troqueros].[dbo].[Peticiones]
                        SET [cliente_id] = @Cliente,
                            [proveedor_id] = @Proveedor,
                            [precio_total] = @Monto,
                            [precio_proveedor] = @PrecioProveedor,
                            [profit] = @Profit,
                            [fecha_salida] = @FechaSalida,
                            [hora_salida] = @HoraSalida,
                            [fecha_modificación] = GETDATE()
                    WHERE [id_peticion] = @ID
                `);

        // Valida que se haya actualizado la petición
        if (result.rowsAffected > 0) {
            // Actualiza los servicios
            // Valida si los servicios estan vacíos
            const updatedServices = request.servicios && request.servicios.length > 0
                ? await UpdOrderServiceRequest(transaction, request.servicios)
                : true;

            // Agrega los nuevos servicios de la petición
            // Valida si los nuevos servicios estan vacíos
            const addedServices = request.nuevos_servicios && request.nuevos_servicios.length > 0 
                ? await InsertOrderServices(transaction, request.nuevos_servicios, request.id_peticion) 
                : true ;

            if (updatedServices && addedServices) {
                await transaction.commit();
                return true;
            }
        }

        await transaction.rollback();
        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'querys/requests/updateRequest/UpdateRequest', error);

        // En caso de error, revierte la transaction
        if (transaction) {
           await transaction.rollback();
        }

        throw new Error('Ha ocurrido un error al actualizar la información de la petición');        
    }
}