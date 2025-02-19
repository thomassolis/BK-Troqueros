import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//Obtiene los cabezales del sistema
export const GetTruckHead = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_cabezal,
                                            placa,
                                            status
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        ORDER BY id_cabezal
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckHead/GetTruckHead', error, 'user');
        throw new Error('No se pudo obtener los cabezales');
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
                                            status
                                        FROM [Troqueros].[dbo].[Cabezal]
                                        WHERE placa LIKE @Search
                                        ORDER BY id_cabezal
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/TruckHead/getTruckHead/GetTruckHeadByFilter', error, 'user');
        throw new Error('No se pudo obtener los cabezales');
    }
}