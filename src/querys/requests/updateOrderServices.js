import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdExtraCostsRequest } from './updateExtraCosts.js';
import { request } from 'express';

// Actualiza os datos de la petición
export const UpdOrderServiceRequest = async (transaction, services) => {
    try {
        const request = await transaction.request();

        let query = '';

        services.forEach((element, index) => {
            request.input(`IDPedidoServicio${index}`, sql.Int, element.id_pedidoServicio)
            request.input(`IDServicioDatos${index}`, sql.Int, element.id_servicio_datos)
            request.input(`Conductor${index}`, sql.VarChar, element.id_conductor)
            request.input(`Chasis${index}`, sql.VarChar, element.id_chasis || null)
            request.input(`Cabezal${index}`, sql.VarChar, element.id_cabezal)
            request.input(`Furgon${index}`, sql.VarChar, element.id_furgon || null)
            request.input(`EntregaVacio${index}`, sql.Bit, element.entrega_vacio || false)
            request.input(`FechaLimite${index}`, sql.VarChar, element.fecha_limite || null)

            query += `
                UPDATE [Troqueros].[dbo].[Pedido_Servicio]
                    SET 
                        [id_conductor] = @Conductor${index},
                        [id_chasis] = @Chasis${index},
                        [id_cabezal] = @Cabezal${index},
                        [id_furgon] = @Furgon${index},
                        [entrega_vacio] = @EntregaVacio${index},
                        [fecha_limite] = @FechaLimite${index}
                WHERE [id_Pedido_Servicio] = @IDPedidoServicio${index} AND [id_servicio_datos] = @IDServicioDatos${index}
            `;
        });

        // Valida que se haya actualizado los servicios
        const result = await request.query(query);
        if (result.rowsAffected > 0 || result.rowsAffected.length > 0) {
            // Actualiza los costos extras
            const updatedExtraCosts = await UpdExtraCostsRequest(transaction, services);
            return updatedExtraCosts;
        }
        
        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'querys/requests/updateOrderServices/UpdOrderServiceRequest', error);
        throw new Error(`Ha ocurrido un error al actualizar la información de los servicios`);
    }
}