import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';

//obtiene todos los chasis
export const GetChassis = async () => {
    try {
        const result = await pool.request()
                                .query(`SELECT
                                            id_chasis,
                                            placa,
                                            status
                                        FROM [Troqueros].[dbo].[Chasis]`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/Chassis/getChassis/GetChassis', error, 'user');
        throw new Error('No se pudo obtener los chasis');
    }
}