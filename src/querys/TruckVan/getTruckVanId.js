import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//obtiene un furgon en especifico
export const GetTruckVanId = async (idFurgon) => {
    try {
        const result = await pool.request()
                                .input("IdFurgon", sql.Char(7), idFurgon)
                                .query(`SELECT
                                            id_furgon,
                                            placa,
                                            status,
                                            numero_poliza,
                                            fecha_expedicion_poliza,
                                            fecha_caducidad_poliza,
                                            fecha_renovacion_revisado,
                                            fecha_ultimo_revisado,
                                            foto_poliza
                                        FROM [Troqueros].[dbo].[Furgon]
                                        WHERE id_furgon = @IdFurgon`);
        
        return result.recordset[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/getTruckVanId/GetTruckVanId', error, 'user');
        throw new Error('No se pudo obtener el furgon');
    }
}