import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//obtiene todos los conductores 
export const GetAllDrivers = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
            .input("Page", sql.Int, page)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .query(`SELECT
                        id_conductor,
                        nombre + ' ' + apellido AS nombreCompleto,
                        cedula,
                        email,
                        telefono,
                        status,
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM [Troqueros].[dbo].[Conductores]
                    ORDER BY id_conductor
                    OFFSET (@Page - 1) * @PageSize ROWS
                    FETCH NEXT @PageSize ROWS ONLY;`);

        // Si no hay registros, devolver una respuesta vacía y un mensaje adecuado
        if (result.recordset.length === 0) {
            return []
        }

        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => rest), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'querys/drivers/getDrivers/GetAllDrivers', error);
        throw new Error('Ha ocurrido un error al obtener los conductores del sistema');
    }
}


//obtiene todos los chasis por filtro
export const GetDriversByFilter = async (page, search) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
            .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
            .input("Search", sql.VarChar, `%${search}%`)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .query(`SELECT
                        id_conductor,
                        nombre + ' ' + apellido AS nombreCompleto,
                        cedula,
                        email,
                        telefono,
                        status,
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM [Troqueros].[dbo].[Conductores]
                    WHERE nombre LIKE @Search
                    ORDER BY id_conductor
                    OFFSET @Page ROWS
                    FETCH NEXT @PageSize ROWS ONLY;`);

        // Si no hay registros, devolver una respuesta vacía y un mensaje adecuado
        if (result.recordset.length === 0) {
            return []
        }

        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => rest), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'querys/drivers/getDrivers/GetDriversByFilter', error);
        throw new Error('Ha ocurrido un error al obtener los conductores solicitados');
    }
}