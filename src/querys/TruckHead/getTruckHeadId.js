import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

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
                                            foto_poliza,
                                            foto_revisado
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        WHERE id_cabezal = @IdCabezal`);
        
        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'querys/TruckHead/getTruckHeadId/GetTruckHeadId', error);
        throw new Error('Ha ocurrido un error al obtener la información del cabezal solicitado');
    }
}