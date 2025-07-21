import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Obtiene la información de un conductor
export const GetDriverByID = async (id) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, id)
            .query(`
                    SELECT
                        [id_conductor],
                        [cedula],
                        [nombre],
                        [apellido],
                        [email],
                        [telefono],
                        [foto_licencia] AS licencia,
                        [foto_PazYSalvo] AS pazSalvo,
                        [status],
                        [tipo_licencia]
                    FROM [Conductores]
                    WHERE [id_conductor] = @ID
                `)

        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.GET)
        HandleError(code, error.message, 'querys/drivers/getDriverID/GetDriverByID', error);
        throw new Error('Ha ocurrido un error al obtener la información del conductor solicitado');
    }
}