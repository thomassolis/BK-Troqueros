import { pool } from '../../db/db.js';
import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GroupServicesByRequets } from '../../auxiliary functions/functionAuxiliary.js';
import { DateConverter, ParseTime } from '../../auxiliary functions/dateConverter.js';

const PAGE_SIZE = 20;

export const GetRequests = async (filters) => {  
  try {
    const page = Math.max(1, parseInt(filters.page ?? '1', 10));
    const idPeticion    = filters.idPeticion    ?? null;
    const nameService   = filters.nameService   ?? null;
    const nameDriver    = filters.nameDriver    ?? null;
    const nameCustomer  = filters.nameCustomer  ?? null;
    const status        = filters.status        ?? null;
    const startDate     = filters.startDate     ?? null;
    const sh            = filters.sh            ?? null;
    const num_contenedor= filters.num_contenedor?? null;
    const numero_factura= filters.numero_factura?? null;
    let   endDate       = (filters.endDate && startDate) ? filters.endDate : null;

    if (startDate && !endDate) {
      endDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD hoy
    }

    const request = await pool.request();
    request.input('Page', sql.Int, page);
    request.input('PageSize', sql.Int, PAGE_SIZE);

    let query = `
      WITH ServiciosCompletos AS (

        SELECT
          P.[id_peticion],
          P.[cliente_id],
          P.[proveedor_id],
          P.[precio_total]        AS monto_peticion,
          P.[precio_proveedor]    AS precio_proveedor,
          P.[profit]              AS profit,
          P.[fecha_creacion],
          P.[fecha_salida],
          P.[hora_salida],
          P.[fecha_finalizacion],
          P.[numero_factura],
          P.[status],

          PS.[id_Pedido_Servicio],
          PS.[comentario]         AS comentario,
          PS.[num_contenedor]     AS numero_contenedor,
          PS.[size_contenedor],
          PS.[numero_referencia]  AS sh,

          S.[nombre]              AS servicio,

          CO.[nombre] + ' ' + CO.[apellido] AS conductor,
          CH.[placa]              AS chasis,
          CA.[placa]              AS cabezal,
          F.[placa]               AS furgon,

          PS.[monto]              AS tarifa,                    
          

          C.[nombre]              AS nombre_cliente,
          PR.[nombre]             AS proveedor,
          SD.[id_servicio_datos],
		      sd.[lugar_origen],
		      sd.[lugar_destino],

          pt.costo,
			    pt.venta,
				PS.id_Pedido_Servicio as 'Servicios_Unicos'
        FROM Peticiones P
        LEFT JOIN Pedido_Servicio  PS  ON PS.[id_peticion]       = P.[id_peticion]
        LEFT JOIN Servicios_datos  SD  ON SD.[id_servicio_datos] = PS.[id_servicio_datos]
        LEFT JOIN Servicios        S   ON S.[id_servicio]        = SD.[id_servicio]
        LEFT JOIN Conductores      CO  ON CO.[id_conductor]      = PS.[id_conductor]
        LEFT JOIN Chasis           CH  ON CH.[id_chasis]         = PS.[id_chasis]
        LEFT JOIN Cabezal          CA  ON CA.[id_cabezal]        = PS.[id_cabezal]
        LEFT JOIN Furgon           F   ON F.[id_furgon]          = PS.[id_furgon]
        LEFT JOIN Clientes         C   ON C.[id_cliente]         = P.[cliente_id]
        LEFT JOIN Proveedores      PR  ON PR.[id_proveedor]      = P.[proveedor_id]

        LEFT JOIN pedidoServicio_preciosTotales AS PSPT ON PSPT.[id_Pedido_Servicio] = PS.[id_Pedido_Servicio]
		    LEFT JOIN preciosTotales AS PT ON PT.[id_preciosTotales] = PSPT.[id_preciosTotales]			
    `;

    const conditions = [];    
    if (idPeticion) {
      request.input('IdPeticion', sql.VarChar, idPeticion);
      conditions.push(`P.[id_peticion] LIKE '%' + @IdPeticion + '%'`);
    }

    if (nameService) {
      request.input('NameService', sql.VarChar, nameService);
      conditions.push(`S.[nombre] LIKE '%' + @NameService + '%'`);
    }

    if (nameDriver) {
      request.input('NameDriver', sql.VarChar, nameDriver);
      // Buscar en nombre + apellido (coincide con el SELECT)
      conditions.push(`(CO.[nombre] + ' ' + CO.[apellido]) LIKE '%' + @NameDriver + '%'`);
    }

    if (nameCustomer) {
      request.input('NameCustomer', sql.VarChar, nameCustomer);
      conditions.push(`C.[nombre] LIKE '%' + @NameCustomer + '%'`);
    }

    if (status) {
      request.input('Status', sql.VarChar, status);
      conditions.push(`P.[status] = @Status`);
    }

    if (sh) {
      request.input('SH', sql.VarChar, sh);
      conditions.push(`PS.[numero_referencia] LIKE '%' + @SH + '%'`);
    }

    if (num_contenedor) {
      request.input('NumContenedor', sql.VarChar, num_contenedor);
      conditions.push(`PS.[num_contenedor] LIKE '%' + @NumContenedor + '%'`);
    }

    if (numero_factura) {            
      request.input('numero_factura', sql.VarChar, numero_factura);
      conditions.push(`P.[numero_factura] LIKE '%' + @numero_factura + '%'`);
    }

    if (startDate && endDate) {
      request.input('StartDate', sql.Date, startDate);
      request.input('EndDate',   sql.Date, endDate);
      conditions.push(`P.[fecha_salida] BETWEEN @StartDate AND @EndDate`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `),
    PeticionesParaPaginacion AS (
      SELECT DISTINCT
        [id_peticion],
        [cliente_id],
        [proveedor_id],
        [fecha_creacion]
      FROM ServiciosCompletos
    ),
    TotalCount AS (
      SELECT COUNT(*) AS totalRegistros FROM PeticionesParaPaginacion
    ),
    PeticionesPaginadas AS (
      SELECT 
        PP.*,
        T.[totalRegistros],
        ROW_NUMBER() OVER (ORDER BY PP.[fecha_creacion] DESC) AS row_num
      FROM PeticionesParaPaginacion PP
      CROSS JOIN TotalCount T
      ORDER BY PP.[fecha_creacion] DESC
      OFFSET (@Page - 1) * @PageSize ROWS
      FETCH NEXT @PageSize ROWS ONLY
    )
    SELECT
      SC.*,
      PP.[totalRegistros]
    FROM ServiciosCompletos SC
    JOIN PeticionesPaginadas PP ON SC.[id_peticion] = PP.[id_peticion]
    ORDER BY PP.[row_num], SC.[id_Pedido_Servicio];`;

    const result = await request.query(query);    

    // Consistencia de shape de respuesta
    if (result.recordset.length === 0) {
      return {
        data: [],
        paginaActual: page,
        totalRegistros: 0,
        limite: PAGE_SIZE
      };
    }

    const data = result.recordset.map(({ totalRegistros, fecha_creacion, fecha_salida, hora_salida, fecha_finalizacion, ...rest }) => ({
      ...rest,
      fecha_creacion:    DateConverter(fecha_creacion),
      fecha_salida:      DateConverter(fecha_salida),
      hora_salida:       ParseTime(hora_salida),
      fecha_finalizacion:DateConverter(fecha_finalizacion),
    }));
    

    return {
      data: GroupServicesByRequets(data), // ojo con el nombre de la función
      paginaActual: page,
      totalRegistros: result.recordset[0].totalRegistros,
      limite: PAGE_SIZE
    };
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
    HandleError(code, error.message, 'querys/requests/getRequests/GetRequests', error);
    throw new Error('Ha ocurrido un error al obtener las peticiones');
  }
};
