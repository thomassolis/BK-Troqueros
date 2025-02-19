import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Elimina un proveedor del sistema
export const DeleteSupplier = async (id) => {
    try {
        const result = await pool.request()
                                .input("Id", sql.Char(7), id)
                                .query(`DELETE [Troqueros].[dbo].[Proveedores]
                                        WHERE id_proveedor = @Id`);

        return result.rowsAffected[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/supplier/deleteSupplier/DeleteSupplier', error, 'user');
        throw new Error('No se pudo eliminar el proveedor');
    }
}