import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { pool } from '../../db/db.js';

//Obtiene los proveedores del sistema
export const GetSuppliers = async () => {
    try {
        const result = await pool.request()
                                .query(`SELECT
                                            id_proveedor,
                                            nombre,
                                            persona_contacto,
                                            celular,
                                            telefono,
                                            email,
                                            numero_cuenta,
                                            tipo_banco
                                        FROM [Troqueros].[dbo].[Proveedores]`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckHead/GetTruckHead', error, 'user');
        throw new Error('No se pudo obtener los proveedores');
    }
}