import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertOrderServices } from './insertOrderService.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';

// Crea una nueva petición
export const InsertNewRequest = async (request) => {
    let transaction = null; // Declaramos transaction null
    try {
        request.hora_salida = GetTime(request.hora_salida); // Obtenemos la hora de salida en formato Time
        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        await transaction.begin() // Iniciamos la transaction

        // Generamos el ID de la petición antes del INSERT
        const idResult = await transaction.request()
            .query(`DECLARE @NuevoID CHAR(8);
                    EXEC Prc_GenerarIDPeticion @NuevoID OUTPUT;
                    SELECT @NuevoID AS [id_peticion];`);

        const idRequest = idResult.recordset[0]?.id_peticion;

        // validamos que id de la petición exista
        if (!idRequest) {
            throw new Error('Ha ocurrido un error al crear la petición');
        }

        let monto = 0; // Declaramos monto con valor inicial de 0
        let profit = 0 // Declaramos el profit con valor inicial de 0

        // Suma las tarifas de los servicios
        // Obtiene el monto total de los servicios solicitados
        for (const item of request.servicios) {
            monto += item.tarifa ? item.tarifa : 0;

            // Suma los precios de los costos extras si existen
            if (Array.isArray(item.costos_extras)) {
                for (const costo of item.costos_extras) {
                    monto += costo.precio ? costo.precio : 0;
                }
            }
        }

        // Valida si la petición es por proveedor
        // Calcula el profit
        if (request?.precio_proveedor) {
            profit = request.servicios[0].tarifa - request.precio_proveedor;
        }
        console.log(request.hora_salida)
        const result = await transaction.request()
            .input("ID", sql.VarChar, idRequest)
            .input("Cliente", sql.VarChar, request.id_cliente)
            .input("Proveedor", sql.VarChar, request.id_proveedor || null)
            .input("PrecioProveedor", sql.Float, request.precio_proveedor || 0)
            .input("Profit", sql.Float, profit)
            .input("Monto", sql.Float, monto)
            .input("FechaSalida", sql.Date, request.fecha_salida)
            .input("HoraSalida", sql.Time, request.hora_salida)
            .input("Status", sql.VarChar, request.status || 'En espera')
            .query(`
                    INSERT INTO [Troqueros].[dbo].[Peticiones] ([id_peticion], [cliente_id], 
                    [proveedor_id], [precio_proveedor], [profit], [precio_total], [fecha_salida], [hora_salida], [status])
                        VALUES (@ID, @Cliente, @Proveedor, @PrecioProveedor, @Profit, @Monto, @FechaSalida, @HoraSalida, @Status)
                `);
        
        // Valida si se hizo el insert
        if (result.rowsAffected > 0) {
            // Agrega los servicios de la petición
            const addedServices = await InsertOrderServices(transaction, request.servicios, idRequest);

            // Valida si se agregaron los servicios de la petición
            // Valida si se actualizó el status del conductor y vehículo
            if (addedServices) {
                await transaction.commit();
                return true;
            }
        }

        await transaction.rollback();
        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/insertRequests/InsertNewRequest', error);

        // En caso de error revertimos la transaction
        if (transaction) {
            await transaction.rollback();
        }
        throw new Error('Ha ocurrido un error al crear una nueva petición');
    }
}