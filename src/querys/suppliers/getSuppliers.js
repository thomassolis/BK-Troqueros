import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Obtiene los proveedores del sistema
export const GetSuppliers = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_proveedor,
                                            nombre,
                                            persona_contacto,
                                            celular,
                                            telefono,
                                            email,
                                            numero_cuenta,
                                            tipo_banco,
                                            CEILING(COUNT(*) OVER() / CAST(@PageSize AS FLOAT)) AS totalPages
                                        FROM [Troqueros].[dbo].[Proveedores]
                                        ORDER BY id_proveedor
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/suppliers/GetSuppliers', error, 'user');
        throw new Error('No se pudo obtener los proveedores');
    }
}



//Obtiene todos los proveedores por filtro
export const GetSuppliersByFilter = async (page, search) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("Search", sql.VarChar, `%${search}%`)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_proveedor,
                                            nombre,
                                            persona_contacto,
                                            celular,
                                            telefono,
                                            email,
                                            numero_cuenta,
                                            tipo_banco,
                                            CEILING(COUNT(*) OVER() / CAST(@PageSize AS FLOAT)) AS totalPages
                                        FROM [Troqueros].[dbo].[Proveedores]
                                        WHERE nombre LIKE @Search
                                        ORDER BY id_proveedor
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/suppliers/GetSuppliersByFilter', error, 'user');
        throw new Error('No se pudo obtener los proveedores');
    }
}