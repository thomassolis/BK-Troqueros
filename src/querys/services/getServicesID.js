import { pool } from '../../db/db.js';
import sql from '../../db/db.js';
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
                        SD.[id_servicio_datos],
                        SD.[id_servicio],
                        S.[nombre],
                        SD.[lugar_origen],
                        SD.[lugar_destino],
                        SD.[tarifa]
                    FROM [Servicios_datos] SD
                        JOIN [Servicios] S
                            ON S.[id_servicio] = SD.[id_servicio]
                    WHERE SD.[id_servicio] = @ID
                `);

        // Valida si la consulta tiene datos
        if (result.recordset === 0) {
            return [];
        }

        return {
            nombre: result.recordset[0].nombre,
            id_servicio: result.recordset[0].id_servicio,
            datos_servicio: result.recordset.map(({nombre, id_servicio, ...rest}) => rest)
        }
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'querys/services/getServicesID/GetServicesID', error);
        throw new Error('Ha ocurrido un error al obtener la información del servicio solicitado');
    }
}