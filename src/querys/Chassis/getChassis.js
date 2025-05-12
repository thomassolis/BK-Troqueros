import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//obtiene todos los chasis 
export const GetChassis = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, page)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_chasis,
                                            placa,
                                            status,
                                            CEILING(COUNT(*) OVER()) AS totalRegistros
                                        FROM [Troqueros].[dbo].[Chasis]
                                        ORDER BY id_chasis
                                        OFFSET (@Page - 1) * @PageSize ROWS
        
                                        FETCH NEXT @PageSize ROWS ONLY;`);
                                        
        // Verificar si hay registros en la respuesta
        const data = result.recordset;

        // Si no hay registros, devolver una respuesta vacía y un mensaje adecuado
        if (data.length === 0) {
            return undefined
        }

        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => rest), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassis/GetChassis', error);
        throw new Error('Ha ocurrido un error al obtener los chasis del sistema');
    }
}


//obtiene todos los chasis por filtro
export const GetChassisByFilter = async (page, search) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("Search", sql.VarChar, `%${search}%`)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_chasis,
                                            placa,
                                            status,
                                            COUNT(*) OVER() AS totalRegistros
                                        FROM [Troqueros].[dbo].[Chasis]
                                        WHERE placa LIKE @Search
                                        ORDER BY id_chasis
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);

        // Verificar si hay registros en la respuesta
        const data = result.recordset;

        // Si no hay registros, devolver una respuesta vacía y un mensaje adecuado
        if (data.length === 0) {
            return undefined
        }

        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => rest), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassis/GetChassisByFilter', error);
        throw new Error('Ha ocurrido un error al obtener los chasis solicitados');
    }
}