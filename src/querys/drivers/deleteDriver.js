import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Elimina un conductor del sistema
export const DeleteDriver = async (id) => {
    try {
        //obtenemos las rutas de los archivos
        const path = await getPathDriver(id);

        //valida que path exista
        if (!path) {
            return false;
        }

        //eliminamos los archivos de poliza y revisado
        const eliminatedLicencia = await DeleteFile(path.licencia);
        const eliminatedPazSalvo = await DeleteFile(path.pazSalvo);

        //validamos que los archivos se hayan eliminado correctamente
        if (!eliminatedLicencia || !eliminatedPazSalvo) {
            throw new Error(`Error al eliminar los archivos del conductor, ${id}`);
        }

        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`DELETE [Conductores]
                    WHERE [id_conductor] = @Id`);
        
        return result.rowsAffected[0];
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.DELETE);
        HandleError(code, error.message, 'querys/drivers/deleteDriver/DeleteDriver', error);
        throw new Error('No se pudo eliminar el conductor');
    }
}

//funcion para obtener la ruta para eliminar el archivo junto con el registro
const getPathDriver = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    SELECT
                        [foto_licencia] AS licencia,
                        [foto_PazYSalvo] AS pazSalvo
                    FROM [Conductores]
                    WHERE [id_conductor] = @Id
                `);

        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'querys/drivers/deleteDriver/getPathDriver', error);
        throw new Error('No se pudo obtener la ruta de los archivos del conductor');
    }
}