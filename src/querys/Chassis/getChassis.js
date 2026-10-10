import { HandleError } from '../../utils/HandleError.js';
import sql from '../../db/db.js';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Establece el tamaño de la página
const PAGE_SIZE = 20;

//obtiene todos los chasis 
export const GetChassis = async (page, active) => {
    try {
        const result = await pool.request()
            .input("Page", sql.Int, page)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, active)
            .query(`SELECT
                        [id_chasis],
                        [placa],
                        [status],
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM [Chasis]
                    WHERE [active] = @Active
                    ORDER BY [id_chasis] DESC
                    OFFSET (@Page - 1) * @PageSize ROWS
                    FETCH NEXT @PageSize ROWS ONLY;`);
                                        
        // Verificar si hay registros en la respuesta
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
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassis/GetChassis', error);
        throw new Error('Ha ocurrido un error al obtener los chasis del sistema');
    }
}


//obtiene todos los chasis por filtro
export const GetChassisByFilter = async (page, search, active) => {
    try {
        const result = await pool.request()
            .input("Page", sql.Int, (page - 1) * PAGE_SIZE)
            .input("Search", sql.VarChar, `%${search}%`)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, active)
            .query(`SELECT
                        [id_chasis],
                        [placa],
                        [status],
                        COUNT(*) OVER() AS totalRegistros
                    FROM [Chasis]
                    WHERE [placa] LIKE @Search AND [active] = @Active
                    ORDER BY [id_chasis]
                    OFFSET @Page ROWS
                    FETCH NEXT @PageSize ROWS ONLY;`);

        // Verificar si hay registros en la respuesta
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
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'querys/Chassis/getChassis/GetChassisByFilter', error);
        throw new Error('Ha ocurrido un error al obtener los chasis solicitados');
    }
}