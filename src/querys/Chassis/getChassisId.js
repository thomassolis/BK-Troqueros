import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { typeError } from '../../dictionary/typeError.js';
import { modules } from '../../dictionary/modules.js';

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
                                            fecha_expedicion_poliza,
                                            fecha_caducidad_poliza,
                                            fecha_renovacion_revisado,
                                            fecha_ultimo_revisado,
                                            foto_poliza,
                                            foto_revisado
                                        FROM [Troqueros].[dbo].[Chasis]
                                        WHERE id_chasis = @IdChassis`);
        
        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassisId/GetChassisId', error);
        throw new Error('Ha ocurrido un error al obtener la información del chasis solicitado');
    }
}