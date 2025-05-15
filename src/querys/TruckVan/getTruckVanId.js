import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';

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
                                            foto_poliza,
                                            foto_revisado
                                        FROM [Troqueros].[dbo].[Furgon]
                                        WHERE id_furgon = @IdFurgon`);
        
        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.GET);
        HandleError(code, error.message, 'querys/TruckVan/getTruckVanId/GetTruckVanId', error);
        throw new Error('Ha ocurrido un error al obtener la información del cabezal solicitado');
    }
}