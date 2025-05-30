import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertDataServices } from './insertServicesInfo.js';

// Crea un nuevo servicio
export const CreateNewService = async (service) => {
    let transaction = null;
    try {
        transaction = new sql.Transaction(pool); // Instanciamos un objeto Transaction
        await transaction.begin(); // Iniciamos la transaction

        const result = await transaction.request()
            .input("NameService", sql.VarChar, service.nombre_servicio)
            .query(`
                    INSERT INTO [Servicios] ([nombre]) 
                        OUTPUT INSERTED.id_servicio
                        VALUES (@NameService)
                `)
            
        // Valida si se hizo el insert
        if (result.rowsAffected > 0) {
            const idService = result.recordset[0].id_servicio;
            const addedInfoServices = await InsertDataServices(transaction, service.datos_servicio, idService);

            if (addedInfoServices) {
                await transaction.commit();
                return true;
            }
        }

        await transaction.rollback();
        return true;
    } catch (error) {
        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback()
        }

        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);

        // Valida si el error ha sido por primary key o unique key
        if (error.number === 2627) {
            let MyThrow =  new Error(`No se pudo crear el servicio, ${error.message}`);
            MyThrow.ErrorCode = 2627;

            if (error.message.includes('PK_')) {
                MyThrow.message = 'UPS... Ha ocurrido un error, inténtelo más tarde.';
            } else {
                MyThrow.message = 'El servicio ya existe en el sistema.';
            }

            HandleError(code, error.message, 'querys/services/createServices/CreateNewService', error);
            throw MyThrow
        }

        HandleError(code, error.message, 'querys/services/createServices/CreateNewService', error);
        throw new Error('Ha ocurrido un error al crear el servicio');
    }
}