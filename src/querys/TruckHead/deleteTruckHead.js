import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Elimina un cabezal del sistema
export const DeleteTruckHead = async (id) => {
    try {
        const result = await pool.request()
                                .input("Id", sql.VarChar, id)
                                .query(`DELETE [Troqueros].[dbo].[Cabezal]
                                        WHERE id_cabezal = @Id`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/deleteTruckHead/DeleteTruckHead', error, 'user');
        throw new Error('No se pudo eliminar el cabezal');
    }
}