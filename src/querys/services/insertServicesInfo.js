import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { CreateNewService } from './createServices.js';


export const InsertDataServices = async (service) => {
    let transaction = null;
    try {
        // Valida si el id del servicio es undefined
        if (!service.id_servicio) {
            service.id_servicio = await CreateNewService(service.nombre_servicio);
        }

        service.id_servicio = parseInt(service.id_servicio); // Convierte el string a un numero '0', '1',...

        transaction = new sql.Transaction(pool) // Instanciamos un objeto Transaction
        await transaction.begin() // Iniciamos la transaction

        let query = `
            INSERT INTO [Servicios_datos] ([id_servicio], [nombre], [lugar_origen], [lugar_destino], [tarifa])
            VALUES 
        `;

        const request = await transaction.request();
        request.input("IDServicio", sql.Int, service.id_servicio)

        let values = []

        service.datos_servicio.forEach((item, index) => {            
            request.input(`Origen${index}`, sql.VarChar, item.origen)
            request.input(`Destino${index}`, sql.VarChar, item.destino)
            request.input(`Tarifa${index}`, sql.Decimal, item.tarifa)

            // Agrega los valores a una lista
            values.push(`(@IDServicio, '', @Origen${index}, @Destino${index}, @Tarifa${index})`)
        });

        query += values.join(', '); // Construye la consulta con los valores a insertar

        const result = await request.query(query);

        if (result.rowsAffected > 0) {
            await transaction.commit();
            return true;
        }

        await transaction.commit();
        return false;
    } catch (error) {
        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback()
        }

        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'querys/services/insertServicesInfo/InsertDataServices', error);
        throw new Error('Ha ocurrido un error al crear el servicio');
    }
}