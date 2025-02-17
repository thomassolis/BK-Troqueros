import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//obtiene un cabezal en especifico
export const GetTruckHeadId = async (idCabezal) => {
    try {
        const result = await pool.request()
                                .input("IdCabezal", sql.Char(7), idCabezal)
                                .query(`SELECT
                                            id_cabezal,
                                            placa,
                                            status,
                                            numero_poliza,
                                            FORMAT(fecha_expedicion_poliza, 'dd:MM:yyyy') AS fecha_expedicion,
                                            FORMAT(fecha_caducidad_poliza, 'dd:MM:yyyy') AS fecha_caducidad,
                                            FORMAT(fecha_renovacion_revisado, 'dd:MM:yyyy') AS fecha_renovacion,
                                            FORMAT(fecha_ultimo_revisado, 'dd:MM:yyyy') AS fecha_ultimo_revisado,
                                            foto_poliza
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        WHERE id_cabezal = @IdCabezal`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckHead/getTruckHeadId/GetTruckHeadId', error, 'user');
        throw new Error('No se pudo obtener los cabezales');
    }
}