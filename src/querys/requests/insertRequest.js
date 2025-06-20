import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertOrderServices } from './insertOrderService.js';


// Crea una nueva petición
export const InsertNewRequest = async (request) => {
    let transaction = null; // Declaramos transaction null
    try {
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

        // Suma las tarifas de los servicios
        // Suma los costos extras de los servicios
        // Obtiene el monto total de los servicios solicitados
        for (const item of request.servicios) {
            monto += (item.tarifa ? item.tarifa : 0) + (item.precio ? item.precio : 0);
        }

        const result = await transaction.request()
            .input("ID", sql.VarChar, idRequest)
            .input("Cliente", sql.VarChar, request.id_cliente)
            .input("Proveedor", sql.VarChar, request.id_proveedor)
            .input("Monto", sql.Float, monto)
            .input("EntregaVacio", sql.Bit, request.entrega_vacio || false)
            .input("FechaSalida", sql.Date, request.fecha_salida)
            .input("Status", sql.VarChar, request.status || 'En espera')
            .query(`
                    INSERT INTO [Troqueros].[dbo].[Peticiones] ([id_peticion], [cliente_id], 
                    [proveedor_id], [precio_total], [entrega_vacio], [fecha_salida], [status])
                        VALUES (@ID, @Cliente, @Proveedor, @Monto, @EntregaVacio, @FechaSalida, @Status)
                `);
        
        // Valida si se hizo el insert
        if (result.rowsAffected > 0) {
            // Agrega los servicios de la petición
            const addedServices = await InsertOrderServices(transaction, request.servicios, idRequest);

            // Valida si se agregaron los servicios de las peticiones y los costos extras
            if (addedServices) {
                await transaction.commit();
                return true;
            }
        }

        await transaction.rollback();
        return false;
    } catch (error) {
        // En caso de error revertimos la transaction
        if (transaction) {
            await transaction.rollback();
        }

        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/insertRequests/InsertNewRequest', error);
        throw new Error('Ha ocurrido un error al crear una nueva petición');
    }
}