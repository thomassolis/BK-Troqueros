import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Elimina un chasis del sistema
export const DeleteChassis = async (id) => {
    try {
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