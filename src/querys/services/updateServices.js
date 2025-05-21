import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertDataServices } from './insertServicesInfo.js';


export const UpdateDataServices = async (service) => {
    let transaction = null;
    try {
        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        await transaction.begin() // Iniciamos la transaction

        let query = `
            UPDATE [Servicios_datos] 
                SET [nombre], [lugar_origen], [lugar_destino], [tarifa]
            VALUES 
        `;

        const request = await transaction.request();

        const sqlParts = [];

        service.datos_servicio.forEach((item, index) => {
            request.input(`ID${index}`, sql.Int, item.id_servicio_datos);
            request.input(`Origen${index}`, sql.VarChar(30), item.lugar_origen);
            request.input(`Destino${index}`, sql.VarChar(30), item.lugar_destino);
            request.input(`Tarifa${index}`, sql.Decimal(10, 2), item.tarifa);

            sqlParts.push(`
                UPDATE [Servicios_datos]
                SET lugar_origen = @Origen${index},
                    lugar_destino = @Destino${index},
                    tarifa = @Tarifa${index}
                WHERE id_servicio_datos = @ID${index};
            `);
        });

        const fullQuery = sqlParts.join('\n');

        const result = await request.query(fullQuery);

        const updatesRealizadas = result.rowsAffected.reduce((a, b) => a + b, 0);

        if (updatesRealizadas !== service.datos_servicio.length) {
            await transaction.commit()
            throw new Error('Algunas actualizaciones no se realizaron correctamente.');
        }

        // Valida si se crearon nuevos datos sobre el servicio
        if (service.datos_servicio_nuevo != 0) {
            // Data a enviar para crear los nuevos datos de información sobre el servicio
            const data = {
                id_servicio: service.id_servicio,
                datos_servicio: service.datos_servicio_nuevo
            }

            const inserted = await InsertDataServices(data); // Inserta los nuevos datos sobre el servicio

            // Valida que se haya hecho el insert
            if (inserted) {
                await transaction.commit()
                return true;
            } else {
                await transaction.rollback();
                return false;
            }
        }

        await transaction.commit()
        return true;
    } catch (error) {
        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback()
        }

        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PUT);
        HandleError(code, error.message, 'querys/services/updateServicesInfo/UpdateDataServices', error);
        throw new Error('Ha ocurrido un error al actualizar la información del servicio');
    }
}