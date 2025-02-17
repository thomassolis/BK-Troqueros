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
                                            status
                                        FROM [Troqueros].[dbo].[Furgon]`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/GetTruckVan', error, 'user');
        throw new Error('No se pudo obtener los furgones');
    }
}