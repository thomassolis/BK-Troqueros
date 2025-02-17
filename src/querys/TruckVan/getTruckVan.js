import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';

//Obtiene los furgones del sistema
export const GetTruckVan = async () => {
    try {
        const result = await pool.request()
                                .query(`SELECT
                                            id_furgon,
                                            placa,
                                            status,
                                            numero_poliza,
                                            FORMAT(fecha_expedicion_poliza, 'dd:MM:yyyy') AS fecha_expedicion,
                                            FORMAT(fecha_caducidad_poliza, 'dd:MM:yyyy') AS fecha_caducidad,
                                            FORMAT(fecha_renovacion_revisado, 'dd:MM:yyyy') AS fecha_renovacion,
                                            FORMAT(fecha_ultimo_revisado, 'dd:MM:yyyy') AS fecha_ultimo_revisado,
                                            foto_poliza
                                        FROM [Troqueros].[dbo].[Furgon]`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/GetTruckVan', error, 'user');
        throw new Error('No se pudo obtener los furgones');
    }
}