import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
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
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'querys/services/createServices/CreateNewService', error);

        // En caso de error revierte la transaction
        if (transaction) {
            await transaction.rollback()
        }
        
        throw new Error('Ha ocurrido un error al crear el servicio');
    }
}