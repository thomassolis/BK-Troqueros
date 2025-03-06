import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';

//Elimina un chasis del sistema
export const DeleteChassis = async (id) => {
    try {
        //obtenemos las rutas de los archivos
        const path = await getPathChassis(id);

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
                                .query(`DELETE [Troqueros].[dbo].[Chasis]
                                        WHERE id_chasis = @Id`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/deleteChassis/DeleteChassis', error, 'user');
        throw new Error('No se pudo eliminar el chasis');
    }
}


//funcion para obtener la ruta para eliminar el archivo junto con el registro
const getPathChassis = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.VarChar, id)
            .query(`
                    SELECT
                        foto_poliza,
                        foto_revisado
                    FROM [Troqueros].[dbo].[Chasis]
                    WHERE id_chasis = @Id
                `);

        return result.recordset[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/deleteChassis/getPathChassis', error, 'user');
        throw new Error('No se pudo eliminar el chasis');
    }
}