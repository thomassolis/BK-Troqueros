import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { BuildArray } from '../../auxiliary functions/functionAuxiliary.js';

// Guarda los costos extras de los servicios
export const AddExtraCostsOrderServices = async (transaction, services, idsPedidoServicios, costosExtras) => {
    try {
        //console.log(services, idsPedidoServicios)
        // Valida si la petición incluye costos extras en los servicios
        if (!costosExtras) {
            return true; // En caso de ser false, retorna true
        }

        // Construye un nuevo array para insertar los costos extras de los servicios
        const newArray = BuildArray(services, idsPedidoServicios);

        const request = await transaction.request();

        let query = `
            INSERT INTO [Troqueros].[dbo].[Costos_Extras] ([id_Pedido_Servicio], [precio], [descripcion])
                VALUES 
        `;

        const values = [];

        newArray.forEach((item, index) => {
            request.input(`Id_Pedido_Servicio${index}`, sql.Int, item.id_Pedido_Servicio);
            request.input(`Precio${index}`, sql.Float, item.precio);
            request.input(`Descripcion${index}`, sql.VarChar, item.descripcion);

            // Agrega los valores a una lista
            values.push(`(
                @Id_Pedido_Servicio${index}, @Precio${index}, @Descripcion${index}
            )`);
        });

        query += values.join(', ');
        
        const result = await request.query(query);

        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        //console.log(error)
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'querys/requests/addExtraCost/AddExtraCostsOrderServices', error);
        throw new Error(`Ha ocurrido un error al insertar los costos extras de los servicios`);
    }
}