import sql from 'mssql';
import { pool } from '../../db/db.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { UpdOrderServiceRequest } from './updateOrderServices.js';
import { InsertOrderServices } from './insertOrderService.js';
import { GetTime } from '../../auxiliary functions/dateConverter.js';
import { RefreshPaymentsRequest } from './updatePaymentsRequest.js';
import { InsertPaymentFiles } from './insertPaymentFiles.js';
// Actualiza la información de una petición
export const UpdateRequest = async (request, idRequest, files, userData) => {            
    let transaction = null
    try {
        request.hora_salida = GetTime(request.hora_salida); // Obtenemos la hora de salida en formato Time
        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction

        await transaction.begin();

        const batchId = crypto.randomUUID();        
        await transaction.request()
        .input("UserId", sql.Int, userData.id_usuario)
        .input("BatchId", sql.UniqueIdentifier, batchId)
        .query(`
            EXEC sys.sp_set_session_context @key=N'UserId',  @value=@UserId;
            EXEC sys.sp_set_session_context @key=N'BatchId', @value=@BatchId;
        `);



        // await transaction.begin(); // Iniciamos la transaction
                
        const result = await transaction.request()
            .input("ID", sql.VarChar, idRequest)
            .input("Cliente", sql.VarChar, request.id_cliente)
            .input("Proveedor", sql.VarChar, request.id_proveedor)
            .input("PrecioProveedor", sql.Float, request.precio_proveedor)
            .input("FechaSalida", sql.Date, request.fecha_salida)
            .input("HoraSalida", sql.Time, request.hora_salida)
            .input("Numero_factura", sql.VarChar, request.numero_factura)
            .query(`
                    UPDATE [Peticiones]
                        SET [cliente_id] = @Cliente,
                            [proveedor_id] = @Proveedor,
                            [precio_proveedor] = @PrecioProveedor,
                            [fecha_salida] = @FechaSalida,
                            [hora_salida] = @HoraSalida,
                            [fecha_modificación] = GETDATE(),
                            [numero_factura] = @Numero_factura
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

            const paymentsRefreshed = await RefreshPaymentsRequest(
                transaction,
                idRequest,
                request.paymentData || []
            );       
                        

            if(files?.paymentFiles){                
                await InsertPaymentFiles(transaction, files.paymentFiles, idRequest);
            }            

            if (updatedServices && addedServices && paymentsRefreshed) {
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
