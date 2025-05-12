import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene los cabezales del sistema
export const GetTruckHead = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, page)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_cabezal,
                                            placa,
                                            status,
                                            CEILING(COUNT(*) OVER()) AS totalRegistros
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        ORDER BY id_cabezal
                                        OFFSET (@Page - 1) * @PageSize ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);

        // Si no hay registros, devolver una respuesta vacía y un mensaje adecuado
        if (result.recordset.length === 0) {
            return undefined
        }
        
        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => rest), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'querys/TruckHead/GetTruckHead', error);
        throw new Error('Ha ocurrido un error al obtener los cabezales del sistema');
    }
}


//obtiene todos los cabezales por filtro
export const GetTruckHeadByFilter = async (page, search) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("Search", sql.VarChar, `%${search}%`)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_cabezal,
                                            placa,
                                            status,
                                            COUNT(*) OVER() AS totalRegistros
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        WHERE placa LIKE @Search
                                        ORDER BY id_cabezal
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);

        // Si no hay registros, devolver una respuesta vacía y un mensaje adecuado
        if (result.recordset.length === 0) {
            return undefined
        }

        return {
            data: result.recordset.map(({ totalRegistros, ...rest }) => rest), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'querys/TruckHead/getTruckHead/GetTruckHeadByFilter', error);
        throw new Error('Ha ocurrido un error al obtener los cabezales solicitados');
    }
}