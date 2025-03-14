import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { typeError } from '../../dictionary/typeError.js';

//Elimina un cabezal del sistema
export const DeleteTruckHead = async (id) => {
    try {
        //obtenemos las rutas de los archivos
        const path = await getPathTruckHead(id);

        //valida que path exista
        if (!path) {
            return false;
        }

        //eliminamos los archivos de poliza y revisado
        const eliminatedPoliza = await DeleteFile(path.foto_poliza);
        const eliminatedRevisado = await DeleteFile(path.foto_revisado);

        //validamos que los archivos se hayan eliminado correctamente
        if (!eliminatedPoliza || !eliminatedRevisado) {
            throw new Error(`Error al eliminar los archivos, ${id}`);
        }

        const result = await pool.request()
                                .input("Id", sql.VarChar, id)
                                .query(`DELETE [Troqueros].[dbo].[Cabezal]
                                        WHERE id_cabezal = @Id`);

        return result.rowsAffected[0];
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.DELETE);
        HandleError(code, error.message, 'querys/deleteTruckHead/DeleteTruckHead', error);
        throw new Error('No se pudo eliminar el cabezal');
    }
}

//funcion para obtener la ruta para eliminar el archivo junto con el registro
const getPathTruckHead = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    SELECT
                        foto_poliza,
                        foto_revisado
                    FROM [Troqueros].[dbo].[Cabezal]
                    WHERE id_cabezal = @Id
                `);

        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.DELETE);
        HandleError(code, error.message, 'querys/deleteTruckHead/getPathTruckHead');
        throw new Error('No se pudo obtener la ruta de los archivos del Cabezal');
    }
}