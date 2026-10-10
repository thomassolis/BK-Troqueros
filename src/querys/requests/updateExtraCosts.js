import sql from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Actualiza los costos extras por servicio
export const UpdExtraCostsRequest = async (transaction, services) => {
    try {
        const request = await transaction.request();

        let index = 0; // Variable auxiliar
        let query = '';

        for (const service of services){
            // Valida si el servicio incluye costos extras
            if (!service.costos_extras) {
                continue;
            }
            
            // Recorre los costos extras de los servicios
            // Construye la consulta
            service.costos_extras.forEach(item => {
                request.input(`IdCostosExtras${index}`, sql.Int, item.id_costos_extras)
                request.input(`IdPedidoServicio${index}`, sql.Int, service.id_pedidoServicio)
                request.input(`Precio${index}`, sql.Float, item.precio)
                request.input(`Descripcion${index}`, sql.VarChar, item.descripcion)

                query += `
                    UPDATE [Costos_Extras]
                        SET [precio] = @Precio${index},
                            [descripcion] = @Descripcion${index}
                    WHERE [id_Costos_Extras] = @IdCostosExtras${index} AND [id_Pedido_Servicio] = @IdPedidoServicio${index}
                `;

                index++; // Incrementa el index
            });            
        }

        // Valida si hay algo que ejecutar
        if (query.trim() === '') {
            return true; // No hay costos extras que actualizar
        }

        // Valida que se haya hecho la actualización de los costos extras
        const result = await request.query(query);
        if (result.rowsAffected > 0 || result.rowsAffected.length > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'querys/requests/updateExtraCosts/UpdExtraCostsRequest', error);
        throw new Error(`Ha ocurrido un error al actualizar los costos extras de los servicios`);
    }
}