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
                                            fecha_expedicion_poliza,
                                            fecha_caducidad_poliza,
                                            fecha_renovacion_revisado,
                                            fecha_ultimo_revisado,
                                            foto_poliza
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        WHERE id_cabezal = @IdCabezal`);
        
        return result.recordset[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckHead/getTruckHeadId/GetTruckHeadId', error, 'user');
        throw new Error('No se pudo obtener los cabezales');
    }
}