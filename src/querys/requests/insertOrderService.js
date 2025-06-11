import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { AddExtraCostsOrderServices } from './addExtraCost.js';

// Inserta los servicios de las peticiones
export const InsertOrderServices = async (transaction, services, idRequest, costosExtras) => {
    try {
        const request = await transaction.request();
        request.input("IDPeticion", sql.VarChar, idRequest);

        let query = `
            DECLARE @InsertedIDs TABLE (
                id_Pedido_Servicio INT, 
                id_conductor CHAR(7),
                id_chasis CHAR(7),
                id_cabezal CHAR(7),
                id_furgon CHAR(7)
            )

            INSERT INTO [Troqueros].[dbo].[Pedido_Servicio] ([id_servicio_datos], [id_peticion],
            [id_conductor], [id_chasis], [id_cabezal], [id_furgon], [entrega_vacio], [fecha_limite])
                OUTPUT 
                    INSERTED.[id_Pedido_Servicio], 
                    INSERTED.[id_conductor],
                    INSERTED.[id_chasis],
                    INSERTED.[id_cabezal],
                    INSERTED.[id_furgon]
                INTO @InsertedIDs
                VALUES 
        `;

        const values = [];

        services.forEach((item, index) => {
            request.input(`Id_servicio_datos${index}`, sql.Int, item.id_servicio_datos);
            request.input(`Conductor${index}`, sql.VarChar, item.id_conductor);
            request.input(`Chasis${index}`, sql.VarChar, item.id_chasis);
            request.input(`Cabezal${index}`, sql.VarChar, item.id_cabezal);
            request.input(`Furgon${index}`, sql.VarChar, item.id_furgon);
            request.input(`EntregaVacio${index}`, sql.Bit, item.entrega_vacio || false);
            request.input(`FechaLimite${index}`, sql.Date, item.fecha_limite);

            // Agrega los valores a una lista
            values.push(`(
                @Id_servicio_datos${index}, @IDPeticion, @Conductor${index}, @Chasis${index}, 
                @Cabezal${index}, @Furgon${index}, @EntregaVacio${index}, @FechaLimite${index}
            )`);
        });

        query += values.join(', ') + `\nSELECT id_Pedido_Servicio, id_conductor,
                id_chasis,
                id_cabezal,
                id_furgon  FROM @InsertedIDs`;
        
        const result = await request.query(query);

        // Valida si se insertaron los servicios de la petición
        if (result.recordset.length > 0 && result.rowsAffected.length > 0 || result.rowsAffected > 0) {
            console.log(result)

            // Agrega los costos extras de los servicios
            const addedExtrasCost = await AddExtraCostsOrderServices(transaction, services, result.recordset, costosExtras)

            return addedExtrasCost;
        }

        return false;
    } catch (error) {
        console.log(error)
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/insertOrderRequests/InsertOrderServices', error);
        throw new Error(`Ha ocurrido un error al insertar los servicios de la petición ${idRequest}`);
    }
}