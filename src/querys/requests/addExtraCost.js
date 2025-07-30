import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { BuildArray } from '../../auxiliary functions/functionAuxiliary.js';

// Guarda los costos extras de los servicios
export const AddExtraCostsOrderServices = async (transaction, services, idsPedidoServicios) => {
    try {
        // Construye un nuevo array para insertar los costos extras de los servicios
        const newArray = BuildArray(services, idsPedidoServicios);

        const request = await transaction.request();

        let query = `
            INSERT INTO [Troqueros].[dbo].[Costos_Extras] ([id_Pedido_Servicio], [precio], [descripcion])
                VALUES 
        `;

        const values = [];

        newArray.forEach((item, index) => {
            // Valida si el servicio incuye costos extras
            if (!item?.precio || !item?.descripcion) {
                return; // Continua con la otra iteración
            }
            request.input(`Id_Pedido_Servicio${index}`, sql.Int, item.id_Pedido_Servicio);
            request.input(`Precio${index}`, sql.Float, item.precio);
            request.input(`Descripcion${index}`, sql.VarChar, item.descripcion);

            // Agrega los valores a una lista
            values.push(`(
                @Id_Pedido_Servicio${index}, @Precio${index}, @Descripcion${index}
            )`);
        });

        // Valida si hay costos por agregar en los servicios
        if (values.length === 0) {
            return true;
        }

        query += values.join(', ');
        
        const result = await request.query(query);

        // Valida que se haya insertado los costos extras
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/addExtraCost/AddExtraCostsOrderServices', error);
        throw new Error(`Ha ocurrido un error al insertar los costos extras de los servicios`);
    }
}


// Agrega nuevos costos extras a los servicios existentes (pedidos)
export const AddNewExtraCostsOrderSrvices = async (transaction, services) => {
    try {
        const request = await transaction.request();

        let query = `
            INSERT INTO [Troqueros].[dbo].[Costos_Extras] ([id_Pedido_Servicio], [precio], [descripcion])
                VALUES 
        `;

        const values = [];
        let contAuxi = 0; // Contador auxiliar para los parametros

        services.forEach(item => {
            // Valida si el servicio tiene nuevos costos extras
            if (!Array.isArray(item.nuevos_costos_extras)) {
                return;
            }

            for (const newExtraCost of item.nuevos_costos_extras) {
                request.input(`Id_Pedido_Servicio${contAuxi}`, sql.Int, item.id_pedidoServicio);
                request.input(`Precio${contAuxi}`, sql.Float, newExtraCost.precio);
                request.input(`Descripcion${contAuxi}`, sql.VarChar, newExtraCost.descripcion);

                // Agrega los valores a una lista
                values.push(`(
                    @Id_Pedido_Servicio${contAuxi}, @Precio${contAuxi}, @Descripcion${contAuxi}
                )`);

                contAuxi++; // Incrementar
            }
        });

        // Valida si hay costos por agregar en los servicios
        if (values.length === 0) {
            return true;
        }

        query += values.join(', ');
        
        const result = await request.query(query);

        // Valida que se haya insertado los costos extras
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'querys/requests/addExtraCost/AddNewExtraCostsOrderSrvices', error);
        throw new Error(`Ha ocurrido un error al agregar los nuevos costos del servicio`);
    }
}