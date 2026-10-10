import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

// Habilita/Deshabilita el proveedor en el sistema
export const ActivateSupplier = async (supplier) => {
    try {
        const result = await pool.request()
            .input("ID", sql.VarChar, supplier.id_proveedor)
            .input("Active", sql.Bit, supplier.active)
            .query(`
                    UPDATE [Proveedores]
                        SET [active] = @Active,
                            [fecha_modificacion] = GETDATE()
                    WHERE [id_proveedor] = @ID
                `)

        // Valida que se haya hecho el update
        if (result.rowsAffected > 0) {
            return true;
        }

        return false;
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.PATCH);
        HandleError(code, error.message, 'querys/suppliers/activateSupplier/ActivateSupplier', error);
        throw new Error(
            chassis.active ? 'Ha ocurrido un error al habilitar el proveedor' : 'Ha ocurrido un error al deshabilitar el proveedor');
    }
}