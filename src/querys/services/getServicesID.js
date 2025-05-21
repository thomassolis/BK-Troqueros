import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene la información de un servicio
export const GetServicesID = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, id)
            .query(`
                    SELECT
                        [id_servicio_datos],
                        [id_servicio],
                        [nombre],
                        [lugar_origen],
                        [lugar_destino],
                        [tarifa]
                    FROM [Servicios_datos]
                    WHERE [id_servicio_datos] = @ID
                `);

        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/services/getServicesID/GetServicesID', error);
        throw new Error('Ha ocurrido un error al obtener la información del servicio solicitado');
    }
}