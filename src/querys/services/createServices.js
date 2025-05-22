import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Crea un nuevo servicio
export const CreateNewService = async (nameService) => {
    try {
        const result = await pool.request()
            .input("NameService", sql.VarChar, nameService)
            .query(`
                    INSERT INTO [Servicios] ([nombre]) 
                        OUTPUT INSERTED.id_servicio
                        VALUES (@NameService)
                `)
            
        return result.recordset[0].id_servicio;
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'querys/services/createServices/CreateNewService', error);
        throw new Error('Ha ocurrido un error al crear el servicio');
    }
}