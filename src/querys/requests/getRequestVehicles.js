import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Obtiene los chasis disponibles y activos del sistema
export const GetRequestChassis = async () => {
    try {
        const result = await pool.request()
            .query(`
                    SELECT 
                        [id_chasis],
                        [placa]
                    FROM [Troqueros].[dbo].[Chasis]
                    WHERE [status] = 'Disponible' AND [active] = 1
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestChssis', error);
        throw new Error('Ha ocurrido un error al obtener los chasis en peticiones');
    }
}


// Obtiene los cabezal disponibles y activos del sistema
export const GetRequestTruckHead = async () => {
    try {
        const result = await pool.request()
            .query(`
                    SELECT 
                        [id_cabezal],
                        [placa]
                    FROM [Troqueros].[dbo].[Cabezal]
                    WHERE [status] = 'Disponible' AND [active] = 1
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestTruckHead', error);
        throw new Error('Ha ocurrido un error al obtener los cabezal en peticiones');
    }
}


// Obtiene los furgon disponibles y activos del sistema
export const GetRequestTruckVan = async () => {
    try {
        const result = await pool.request()
            .query(`
                    SELECT 
                        [id_furgon],
                        [placa]
                    FROM [Troqueros].[dbo].[Furgon]
                    WHERE [status] = 'Disponible' AND [active] = 1
                `);

        // Valida si la consulta arrojo datos
        if (result.recordset.length > 0) {
            return result.recordset;
        }

        return null;
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.FURGONES.GET);
        HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestTruckVan', error);
        throw new Error('Ha ocurrido un error al obtener los furgon en peticiones');
    }
}