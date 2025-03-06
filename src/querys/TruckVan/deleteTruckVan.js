import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';

//Elimina un furgon del sistema
export const DeleteTruckVan = async (id) => {
    try {
        //obtenemos las rutas de los archivos
        const path = await getPathTruckVan(id);

        //valida que path exista
        if (!path) {
            return false;
        }

        //eliminamos los archivos de poliza y revisado
        const eliminatedPoliza = await DeleteFile(path.foto_poliza);
        const eliminatedRevisado = await DeleteFile(path.foto_revisado);

        //validamos que los archivos se hayan eliminado correctamente
        if (!eliminatedPoliza || !eliminatedRevisado) {
            throw new Error(`Error al eliminar los archivos`);
        }

        const result = await pool.request()
                                .input("Id", sql.Char(7), id)
                                .query(`DELETE [Troqueros].[dbo].[Furgon]
                                        WHERE id_furgon = @Id`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/deleteTruckVan/DeleteTruckVan', error, 'user');
        throw new Error('No se pudo eliminar el furgon');
    }
}

//funcion para obtener la ruta para eliminar el archivo junto con el registro
const getPathTruckVan = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    SELECT
                        foto_poliza,
                        foto_revisado
                    FROM [Troqueros].[dbo].[Furgon]
                    WHERE id_furgon = @Id
                `);

        return result.recordset[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/deleteTruckVan/getPathTruckVan', error, 'user');
        throw new Error('No se pudo eliminar el Furgon');
    }
}