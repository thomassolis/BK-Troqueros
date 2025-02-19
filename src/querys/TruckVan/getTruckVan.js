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
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_furgon,
                                            placa,
                                            status,
                                            CEILING(COUNT(*) OVER() / CAST(@PageSize AS FLOAT)) AS totalPages
                                        FROM [Troqueros].[dbo].[Furgon]
                                        ORDER BY id_furgon
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
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
                                            CEILING(COUNT(*) OVER() / CAST(@PageSize AS FLOAT)) AS totalPages
                                        FROM [Troqueros].[dbo].[Furgon]
                                        WHERE placa LIKE @Search
                                        ORDER BY id_furgon
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckVan/getTruckVan/GetTruckVanByFilter', error, 'user');
        throw new Error('No se pudo obtener los furgones');
    }
}