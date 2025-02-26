import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Obtiene los furgones del sistema
export const GetTruckVan = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, page)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_furgon,
                                            placa,
                                            status,
                                            CEILING(COUNT(*) OVER()) AS totalRegistros
                                        FROM [Troqueros].[dbo].[Furgon]
                                        ORDER BY id_furgon
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
        HandleError(v1(), error.message, 'querys/TruckVan/GetTruckVan', error, 'user');
        throw new Error('No se pudo obtener los furgones');
    }
}


//obtiene todos los furgones por filtro
export const GetTruckVanByFilter = async (page, search) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("Search", sql.VarChar, `%${search}%`)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_furgon,
                                            placa,
                                            status,
                                            CEILING(COUNT(*) OVER()) AS totalRegistros
                                        FROM [Troqueros].[dbo].[Furgon]
                                        WHERE placa LIKE @Search
                                        ORDER BY id_furgon
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
        HandleError(v1(), error.message, 'querys/TruckVan/getTruckVan/GetTruckVanByFilter', error, 'user');
        throw new Error('No se pudo obtener los furgones');
    }
}