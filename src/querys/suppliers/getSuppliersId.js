import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//obtiene un proveedor en especifico
export const GetSuppleirId = async (idSupplier) => {
    try {
        const result = await pool.request()
            .input("IdSupplier", sql.Char(7), idSupplier)
            .query(`SELECT
                        [id_proveedor],
                        [nombre],
                        [persona_contacto],
                        [celular],
                        [telefono],
                        [email],
                        [numero_yappy],
                        [nombre_cuenta],
                        [numero_cuenta],
                        [tipo_banco]
                    FROM [Proveedores]
                    WHERE id_proveedor = @IdSupplier`);
        
        return result.recordset[0];
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.GET)
        HandleError(code, error.message, 'querys/suppliers/getSuppliersId/GetSuppleirId', error);
        throw new Error('Ha ocurrido un error al obtener la información del proveedor solicitado');
    }
}