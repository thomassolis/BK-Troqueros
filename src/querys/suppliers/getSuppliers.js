import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


const PAGE_SIZE = 20; //Establece el tamaño de la página

//Obtiene los proveedores del sistema
export const GetSuppliers = async (page, active) => {
    try {
        const result = await pool.request()
            .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, active)
            .query(`SELECT
                        [id_proveedor],
                        [nombre],
                        [persona_contacto],
                        [celular],
                        [telefono],
                        [email],
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM [Troqueros].[dbo].[Proveedores]
                    WHERE [active] = @Active
                    ORDER BY [id_proveedor] DESC
                    OFFSET @Page ROWS
                    FETCH NEXT @PageSize ROWS ONLY;`);
        
        // Valida si la consulta tiene datos
        if (result.recordset.length === 0) {
            return []
        }
        
        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => ({
                ...rest,
            })), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.GET)
        HandleError(code, error.message, 'querys/suppliers/GetSuppliers', error);
        throw new Error('Ha ocurrido un error al obtener los proveedores');
    }
}



//Obtiene todos los proveedores por filtro
export const GetSuppliersByFilter = async (page, search, active) => {
    try {
        const result = await pool.request()
            .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
            .input("Search", sql.VarChar, `%${search}%`)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, active)
            .query(`SELECT
                        [id_proveedor],
                        [nombre],
                        [persona_contacto],
                        [celular],
                        [telefono],
                        [email],
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM [Troqueros].[dbo].[Proveedores]
                    WHERE [nombre] LIKE @Search AND [Active] = @Active
                    ORDER BY [id_proveedor]
                    OFFSET @Page ROWS
                    FETCH NEXT @PageSize ROWS ONLY;`);
        
        // Valida si la consulta tiene datos
        if (result.recordset.length === 0) {
            return []
        }
        
        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => ({
                ...rest,
            })), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.GET)
        HandleError(code, error.message, 'querys/suppliers/GetSuppliersByFilter', error);
        throw new Error('Ha ocurrido un error al obtener los proveedores solicitdados');
    }
}