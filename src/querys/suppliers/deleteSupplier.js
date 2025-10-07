import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Elimina un proveedor del sistema
export const DeleteSupplier = async (id) => {
    try {
        const result = await pool.request()
            .input("Id", sql.Char(7), id)
            .query(`DELETE [Proveedores]
                    WHERE id_proveedor = @Id`);

        // Valida que se haya hecho la eliminación
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.DELETE)
        HandleError(code, error.message, 'querys/supplier/deleteSupplier/DeleteSupplier', error);
        throw new Error('Ha ocurrido un error al eliminar el proveedor');
    }
}
