import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';

//obtiene todos los chasis 
export const GetChassis = async (page) => {
    try {
        //Establece el tamaño de la página
        const PAGE_SIZE = 20;

        const result = await pool.request()
                                .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
                                .input("PageSize", sql.Int, PAGE_SIZE)
                                .query(`SELECT
                                            id_chasis,
                                            placa,
                                            status,
                                            CEILING(COUNT(*) OVER() / CAST(@PageSize AS FLOAT)) AS totalPages
                                        FROM [Troqueros].[dbo].[Chasis]
                                        ORDER BY id_chasis
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/Chassis/getChassis/GetChassis', error, 'user');
        throw new Error('No se pudo obtener los chasis');
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
                                            CEILING(COUNT(*) OVER() / CAST(@PageSize AS FLOAT)) AS totalPages
                                        FROM [Troqueros].[dbo].[Chasis]
                                        WHERE placa LIKE @Search
                                        ORDER BY id_chasis
                                        OFFSET @Page ROWS
                                        FETCH NEXT @PageSize ROWS ONLY;`);
        
        return result.recordsets;
    } catch (error) {
        HandleError(v1(), error.message, 'querys/Chassis/getChassis/GetChassis', error, 'user');
        throw new Error('No se pudo obtener los chasis');
    }
}