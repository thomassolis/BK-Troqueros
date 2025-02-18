import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//obtiene un chasis en especifico
export const GetChassisId = async (idChassis) => {
    try {
        const result = await pool.request()
                                .input("IdChassis", sql.Char(7), idChassis)
                                .query(`SELECT
                                            id_chasis,
                                            placa,
                                            status,
                                            numero_poliza,
                                            FORMAT(fecha_expedicion_poliza, 'dd:MM:yyyy') AS fecha_expedicion,
                                            FORMAT(fecha_caducidad_poliza, 'dd:MM:yyyy') AS fecha_caducidad,
                                            FORMAT(fecha_renovacion_revisado, 'dd:MM:yyyy') AS fecha_renovacion,
                                            FORMAT(fecha_ultimo_revisado, 'dd:MM:yyyy') AS fecha_ultimo_revisado,
                                            foto_poliza
                                        FROM [Troqueros].[dbo].[Chasis]
                                        WHERE id_chasis = @IdChassis`);
        
        return result.recordset[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/Chassis/getChassisId/GetChassisId', error, 'user');
        throw new Error('No se pudo obtener los chasis');
    }
}