import { HandleError } from '../../utils/HandleError.js';
import sql from 'mssql';
import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DateConverterSQL } from '../../auxiliary functions/dateConverter.js';

const PAGE_SIZE = 20; //Establece el tamaño de la página

// Obtiene todos los clientes
export const GetAllClients = async (page, active) =>  {
    try {
        const result = await pool.request()
            .input("Page", sql.Int, page)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, active)
            .query(`
                    SELECT
                        C.[id_cliente],
                        C.[nombre],
                        C.[nombre_persona_contacto] AS personaContacto,
                        C.[telefono_persona_contacto] AS telefono,
                        C.[email_persona_contacto] AS correo,
                        MAX(P.[fecha_creacion]) AS fechaUltimoPedido,
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM Clientes C LEFT JOIN Peticiones P
                        ON C.[id_cliente] = P.[cliente_id]
                    WHERE C.[active] = @Active
                    GROUP BY 
                        C.[id_cliente], 
                        C.[nombre],
                        C.[nombre_persona_contacto],
                        C.[telefono_persona_contacto],
                        C.[email_persona_contacto],
                        C.[fecha_creacion]
                    ORDER BY C.[fecha_creacion] DESC
                    OFFSET (@Page - 1) * @PageSize ROWS
                    FETCH NEXT @PageSize ROWS ONLY
                `)

        // Valida si la consulta obtuvo dados
        if (result.recordset.length === 0) {
            return []
        }

        return {
            data: result.recordset.map(({ totalRegistros, fechaUltimoPedido, ...rest }) => ({
                ...rest,
                fechaUltimoPedido: DateConverterSQL(fechaUltimoPedido)
            })), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.GET);
        HandleError(code, error.message, 'querys/clients/getClients/GetAllClients', error);
        throw new Error('Ha ocurrido un error al obtener los clientes');
    }
}


// Filtra los clientes por nombre
export const GetClientsFilters = async (page, nameCustomer, active) => {
    try {
        const result = await pool.request()
            .input("SearchName", sql.VarChar, nameCustomer)
            .input("Page", sql.Int, page)
            .input("PageSize", sql.Int, PAGE_SIZE)
            .input("Active", sql.Bit, active)
            .query(`
                    SELECT
                        C.[id_cliente],
                        C.[nombre],
                        C.[nombre_persona_contacto] AS personaContacto,
                        C.[telefono_persona_contacto] AS telefono,
                        C.[email_persona_contacto] AS correo,
                        MAX(P.[fecha_creacion]) AS fechaUltimoPedido,
                        CEILING(COUNT(*) OVER()) AS totalRegistros
                    FROM Clientes C LEFT JOIN Peticiones P
                        ON C.[id_cliente] = P.[cliente_id]
                    WHERE C.[nombre] LIKE '%' + @SearchName + '%' AND C.[active] = @Active
                    GROUP BY 
                        C.[id_cliente], 
                        C.[nombre],
                        C.[nombre_persona_contacto],
                        C.[telefono_persona_contacto],
                        C.[email_persona_contacto],
                        C.[fecha_creacion]
                    ORDER BY C.[fecha_creacion] DESC
                    OFFSET (@Page - 1) * @PageSize ROWS
                    FETCH NEXT @PageSize ROWS ONLY
                `)

        // Valida si la consulta obtuvo dados
        if (result.recordset.length === 0) {
            return []
        }

        return {
            data: result.recordset.map(({ totalRegistros, fechaUltimoPedido, ...rest }) => ({
                ...rest,
                fechaUltimoPedido: DateConverterSQL(fechaUltimoPedido)
            })), // Excluir totalRegistros del array de datos
            paginaActual: page,
            totalRegistros: result.recordset[0].totalRegistros,
            limite: PAGE_SIZE
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.GET);
        HandleError(code, error.message, 'querys/clients/getClients/GetAllClients', error);
        throw new Error('Ha ocurrido un error al buscar el cliente');
    }
}