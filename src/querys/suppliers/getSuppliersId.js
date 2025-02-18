import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//obtiene un proveedor en especifico
export const GetSuppleirId = async (idSupplier) => {
    try {
        const result = await pool.request()
                                .input("IdSupplier", sql.Char(7), idSupplier)
                                .query(`SELECT
                                            id_proveedor,
                                            nombre,
                                            persona_contacto,
                                            celular,
                                            telefono,
                                            email,
                                            numero_cuenta,
                                            tipo_banco
                                        FROM [Troqueros].[dbo].[Proveedores]
                                        WHERE id_proveedor = @IdSupplier`);
        
        return result.recordset[0];
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/getTruckVanId/GetTruckVanId', error, 'user');
        throw new Error('No se pudo obtener el furgon');
    }
}