import { pool } from "../../db/db.js";
import sql from '../../db/db.js';
import { GenerateCodeError } from "../../utils/getCodeError.js";
import { HandleError } from "../../utils/HandleError.js";
import { modules } from "../../dictionary/modules.js";
import { typeError } from "../../dictionary/typeError.js";


export const getReports = async(filters) => {    
    const serviceID = filters.serviceID
    const driverID = filters.driverID
    const customerID = filters.customerID
    const startDate = filters.startDate
    const endDate = filters.endDate
    

    try{
        const reports = pool.request();

        let whereConditions = [];

        if (serviceID) {
            whereConditions.push(`SD.id_servicio = @serviceID`);
            reports.input('serviceID', sql.Int, serviceID);  // Asegúrate de pasar el valor del ID
        }
        if(driverID){
            whereConditions.push(`PS.id_conductor = @driverID`);
            reports.input('driverID', sql.VarChar, driverID);
        }
        if(customerID){
            whereConditions.push(`P.cliente_id = @customerID`);
            reports.input('customerID', sql.VarChar, customerID);
        }
        if(startDate && endDate){
            whereConditions.push(`
                (P.fecha_salida BETWEEN @startDate AND @endDate OR P.fecha_finalizacion BETWEEN @startDate AND @endDate)
            `);
            reports.input('startDate', sql.Date, startDate);
            reports.input('endDate', sql.Date, endDate);
        }

        //Total de peticiones
        const query1 = `
                            Select count(*) as total_peticiones 
                            from pedido_servicio PS
                            left join Servicios_datos SD on sd.id_servicio_datos = PS.id_servicio_datos                            
                            left join Peticiones P on P.id_peticion = PS.id_peticion
                            ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
                        `
        const result1 = await reports.query(query1);

        //Costo total de las peticiones
        const query2 = `select sum (pt.costo) as costototal
                            from precios_totales pt
                            left join pedido_servicio_precios_totales pp on pp.id_precios_totales = pt.id_precios_totales
                            left join Pedido_Servicio ps on ps.id_pedido_servicio = pp.id_pedido_servicio
                            left join Peticiones P on P.id_peticion = ps.id_peticion
                            left join Servicios_datos sd on sd.id_servicio_datos = ps.id_servicio_datos
                            ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
                        `                    
        const result2 = await reports.query(query2);

        //Ventas totales de las peticiones

        const query3 = `select 
                            sum (pt.venta) as ventatotal
                            from precios_totales pt
                            left join pedido_servicio_precios_totales pp on pp.id_precios_totales = pt.id_precios_totales
                            left join Pedido_Servicio ps on ps.id_pedido_servicio = pp.id_pedido_servicio
                            left join Peticiones P on P.id_peticion = ps.id_peticion
                            left join Servicios_datos sd on sd.id_servicio_datos = ps.id_servicio_datos
                            ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
                        `
        const result3 = await reports.query(query3);


        //Datos para gráfica
        // Consulta para obtener las peticiones y clientes
        const query4 = `	
            SELECT 
                COUNT(P.id_peticion) as peticiones,
                c.nombre as "Nombre_de_cliente"
            FROM Peticiones P
            INNER JOIN Clientes c ON c.id_cliente = P.cliente_id
            LEFT JOIN Pedido_Servicio ps ON ps.id_peticion = P.id_peticion
            LEFT JOIN Servicios_datos SD ON sd.id_servicio_datos = PS.id_servicio_datos  
            ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
            GROUP BY c.id_cliente, c.nombre
        `;

        const result4 = await reports.query(query4);

        // Consulta para obtener las rutas y ventas
        const query5 = `
            SELECT     
                sd.[lugar_origen],
                sd.[lugar_destino],          
                SUM(pt.venta) as total_venta,
                COUNT(DISTINCT ps.id_pedido_servicio) as total_pedidos
            FROM [Servicios_datos] sd
                LEFT JOIN Pedido_Servicio ps ON ps.id_servicio_datos = sd.id_servicio_datos
                left join Peticiones P on P.id_peticion = ps.id_peticion
                LEFT JOIN pedido_servicio_precios_totales PSPT ON PSPT.id_pedido_servicio = ps.id_pedido_servicio
                LEFT JOIN precios_totales PT ON PT.id_precios_totales = PSPT.id_precios_totales
                ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
            GROUP BY 
                sd.id_servicio_datos,
                sd.id_servicio,
                sd.lugar_origen,
                sd.lugar_destino
            ORDER BY total_venta DESC
            LIMIT 5;
        `;

        const result5 = await reports.query(query5);

        // Organizar los datos de ambos reportes
        const reportsData = {
            bestCustomers: result4.recordset.map(row => ({
                peticiones: row.peticiones,
                nombreDeCliente: row.Nombre_de_cliente ?? row.nombre_de_cliente,
            })),
            bestRoutes: result5.recordset.map(row => ({
                lugar_origen: row.lugar_origen,
                lugar_destino: row.lugar_destino,
                total_venta: row.total_venta,
                total_pedidos: row.total_pedidos,
            }))
        };

        // Devolver los datos combinados con las métricas adicionales
        return {
            totalPeticiones: result1.recordset[0].total_peticiones,
            totalCostos: result2.recordset[0].costototal,
            totalVentas: result3.recordset[0].ventatotal,
            ganancias: result3.recordset[0].ventatotal - result2.recordset[0].costototal,
            graphData: reportsData
        };

    }catch(error){
        console.error('Error en getReports: ', error);
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'querys/reports/getReports', error);
        throw new Error('Ha ocurrido un error al obtener los reportes');
    }    
}
const parseDMY = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  // acepta "DD/MM/YYYY" o "DD-MM-YYYY"
  const m = dateStr.trim().match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);

  // validaciones básicas
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  // construir Date local (evita parsing por string)
  const d = new Date(year, month - 1, day);

  // valida que no se haya “autocorregido” (ej: 31/02 => se vuelve marzo)
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;

  return d;
};

const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());

export const getReportsTeam = async (page, pageSize, searchTerm, driverSearch, statusSelected, dates) => {  
  // ✅ Blindaje básico
  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safePageSize = Number.isFinite(Number(pageSize)) && Number(pageSize) > 0 ? Number(pageSize) : 10;
  const safeSearch = (searchTerm ?? '').trim();
  const safeDriver = (driverSearch ?? '').trim();
  const safeStatus = (statusSelected ?? 'todos').trim();

  const start = parseDMY(dates?.startDate);
  const end = parseDMY(dates?.endDate);
  

  try {
    const offset = (safePage - 1) * safePageSize;    
    // ========== QUERIES SIN PARÁMETROS (3 instancias separadas) ==========
    
    const queryConductores = `
      SELECT COUNT(DISTINCT PS.id_conductor) AS conductoresActivos
      FROM [TroquerosProduccion].[dbo].[Pedido_Servicio] PS
      LEFT JOIN Conductores CO ON PS.id_conductor = CO.id_conductor
      LEFT JOIN Peticiones P ON PS.id_peticion = P.id_peticion
      WHERE P.status = 'en proceso'
        AND CO.nombre IS NOT NULL;
    `;

    const queryEquipos = `
      SELECT COUNT(PS.id_chasis) + COUNT(PS.id_furgon) + COUNT(PS.id_cabezal) AS equiposActivos
      FROM [TroquerosProduccion].[dbo].[Pedido_Servicio] PS
      LEFT JOIN Peticiones P ON PS.id_peticion = P.id_peticion
      WHERE P.status = 'en proceso'
        AND (PS.id_chasis IS NOT NULL OR PS.id_furgon IS NOT NULL OR PS.id_cabezal IS NOT NULL);
    `;

    const queryTiemposExcedidos = `
      SELECT COUNT(P.tiempoExcedido) AS cantTiemposExcedidos
      FROM [TroquerosProduccion].[dbo].[Peticiones] P
      LEFT JOIN Pedido_Servicio PS ON P.id_peticion = PS.id_peticion
      WHERE P.tiempoExcedido > 0
        AND (@driverID IS NULL OR @driverID = '' OR @driverID = 'todos' OR PS.id_conductor = @driverID)
        AND (@startDate IS NULL OR P.fecha_salida >= @startDate)
        AND (@endDate IS NULL OR P.fecha_salida < DATEADD(DAY, 1, @endDate))
        AND (
          @statusSelected = 'todos'
          OR @statusSelected = 'excedido'
        )
    `;

    const queryTiemposEnRegla = `
      SELECT COUNT(P.tiempoExcedido) AS tiempoEnRegla
      FROM [TroquerosProduccion].[dbo].[Peticiones] P
      LEFT JOIN Pedido_Servicio PS ON P.id_peticion = PS.id_peticion
      WHERE P.tiempoExcedido = 0
        AND P.fecha_finalizacion IS NOT NULL
        AND (@driverID IS NULL OR @driverID = '' OR @driverID = 'todos' OR PS.id_conductor = @driverID)
        AND (@startDate IS NULL OR P.fecha_salida >= @startDate)
        AND (@endDate IS NULL OR P.fecha_salida < DATEADD(DAY, 1, @endDate))
        AND (
          @statusSelected = 'todos'
          OR @statusSelected = 'en_tiempo'
        )
    `;
    

    // ========== WHERE FILTERS (compartido por totalRows y data) ==========

    const whereFilters = `
      WHERE 1=1
        AND (
          @searchTerm = '%%' 
          OR CAST(P.id_peticion AS VARCHAR(50)) LIKE @searchTerm 
          OR C.nombre LIKE @searchTerm
        )
        AND (
          @driverID IS NULL OR @driverID = '' OR @driverID = 'todos'
          OR PS.id_conductor = @driverID
        )
        AND (@startDate IS NULL OR P.fecha_salida >= @startDate)
        AND (@endDate IS NULL OR P.fecha_salida < DATEADD(DAY, 1, @endDate))
        AND (
          @statusSelected = 'todos'
          OR (
            @statusSelected = 'en_tiempo' 
            AND (
              CASE
                WHEN ISNULL(P.tiempoExcedido, 0) > 0 THEN 'excedido'
                WHEN P.fecha_salida IS NULL OR SD.tiempo_estimado IS NULL THEN 'en_tiempo'
                WHEN (DATEDIFF(MINUTE, P.fecha_salida, COALESCE(P.fecha_finalizacion, GETDATE())) / 60.0) > SD.tiempo_estimado THEN 'excedido'
                ELSE 'en_tiempo'
              END
            ) = 'en_tiempo'
          )
          OR (
            @statusSelected = 'excedido' 
            AND (
              CASE
                WHEN ISNULL(P.tiempoExcedido, 0) > 0 THEN 'excedido'
                WHEN P.fecha_salida IS NULL OR SD.tiempo_estimado IS NULL THEN 'en_tiempo'
                WHEN (DATEDIFF(MINUTE, P.fecha_salida, COALESCE(P.fecha_finalizacion, GETDATE())) / 60.0) > SD.tiempo_estimado THEN 'excedido'
                ELSE 'en_tiempo'
              END
            ) = 'excedido'
          )
        )
    `;
    
    // ========== QUERY TOTAL ROWS (con filtros) ==========
    
    const queryTotalRows = `
      SELECT COUNT_BIG(*) AS totalRows
      FROM (
        SELECT P.id_peticion
        FROM Peticiones P
        LEFT JOIN Pedido_Servicio PS ON PS.id_peticion = P.id_peticion
        LEFT JOIN Servicios_datos SD ON SD.id_servicio_datos = PS.id_servicio_datos
        LEFT JOIN Conductores CO ON CO.id_conductor = PS.id_conductor
        LEFT JOIN Chasis CH ON CH.id_chasis = PS.id_chasis
        LEFT JOIN Cabezal CA ON CA.id_cabezal = PS.id_cabezal
        LEFT JOIN Furgon F ON F.id_furgon = PS.id_furgon
        LEFT JOIN Clientes C ON C.id_cliente = P.cliente_id
        LEFT JOIN pedido_servicio_precios_totales PSPT ON PSPT.id_pedido_servicio = PS.id_pedido_servicio
        LEFT JOIN precios_totales PT ON PT.id_precios_totales = PSPT.id_precios_totales
        ${whereFilters}
        GROUP BY P.id_peticion
      ) X;
    `;

    // ========== QUERY DATA COMPLETA (con filtros + paginación) ==========
    
    const queryDataCompleta = `
      SELECT
        P.id_peticion AS idPeticion,
        C.nombre AS cliente,
        CO.nombre + ' ' + CO.apellido AS conductor,
        CH.placa AS chasis,
        CA.placa AS cabezal,
        F.placa AS furgon,
        SD.lugar_origen,
        SD.lugar_destino,
        P.fecha_salida,
        P.fecha_finalizacion,
        P.tiempoExcedido,
        P.proveedor_id,
        SD.tiempo_estimado,
        CAST(
          DATEDIFF(MINUTE, P.fecha_salida, COALESCE(P.fecha_finalizacion, GETDATE())) / 60.0
          AS DECIMAL(10,1)
        ) AS duracionRealHrs,
        CASE
          WHEN ISNULL(P.tiempoExcedido, 0) > 0 THEN 'excedido'
          WHEN P.fecha_salida IS NULL OR SD.tiempo_estimado IS NULL THEN 'en_tiempo'
          --WHEN (DATEDIFF(MINUTE, P.fecha_salida, COALESCE(P.fecha_finalizacion, GETDATE())) / 60.0) > SD.tiempo_estimado THEN 'excedido'
          ELSE 'en_tiempo'
        END AS status
      FROM Peticiones P
      LEFT JOIN Pedido_Servicio PS ON PS.id_peticion = P.id_peticion
      LEFT JOIN Servicios_datos SD ON SD.id_servicio_datos = PS.id_servicio_datos
      LEFT JOIN Conductores CO ON CO.id_conductor = PS.id_conductor
      LEFT JOIN Chasis CH ON CH.id_chasis = PS.id_chasis
      LEFT JOIN Cabezal CA ON CA.id_cabezal = PS.id_cabezal
      LEFT JOIN Furgon F ON F.id_furgon = PS.id_furgon
      LEFT JOIN Clientes C ON C.id_cliente = P.cliente_id
      LEFT JOIN pedido_servicio_precios_totales PSPT ON PSPT.id_pedido_servicio = PS.id_pedido_servicio
      LEFT JOIN precios_totales PT ON PT.id_precios_totales = PSPT.id_precios_totales
      ${whereFilters}
      GROUP BY
        P.id_peticion, C.nombre, CO.nombre, CO.apellido, CH.placa, CA.placa, F.placa,
        SD.lugar_origen, SD.lugar_destino, P.fecha_salida, P.fecha_finalizacion,
        P.tiempoExcedido, P.proveedor_id, SD.tiempo_estimado
      ORDER BY P.fecha_salida DESC, P.id_peticion DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    // ========== CREAR INSTANCIAS SEPARADAS DE REQUEST ==========
    
    const req1 = pool.request();
    const req2 = pool.request();
    const req3 = pool.request();
    const req4 = pool.request();

    // ✅ params para KPIs con fechas + conductor
    req3.input('driverID', sql.VarChar, safeDriver || 'todos');
    req3.input('startDate', sql.DateTime, start);
    req3.input('endDate', sql.DateTime, end);
    req3.input('statusSelected', sql.VarChar, safeStatus);

    req4.input('driverID', sql.VarChar, safeDriver || 'todos');
    req4.input('startDate', sql.DateTime, start);
    req4.input('endDate', sql.DateTime, end);
    req4.input('statusSelected', sql.VarChar, safeStatus);
    
    const reqTotalRows = pool.request();
    reqTotalRows.input('searchTerm', sql.VarChar, `%${safeSearch}%`);
    reqTotalRows.input('driverID', sql.VarChar, safeDriver || 'todos');
    reqTotalRows.input('startDate', sql.DateTime, start);
    reqTotalRows.input('endDate', sql.DateTime, end);
    reqTotalRows.input('statusSelected', sql.VarChar, safeStatus);

    const reqData = pool.request();
    reqData.input('offset', sql.Int, offset);
    reqData.input('pageSize', sql.Int, safePageSize);
    reqData.input('searchTerm', sql.VarChar, `%${safeSearch}%`);
    reqData.input('driverID', sql.VarChar, safeDriver || 'todos');
    reqData.input('startDate', sql.DateTime, start);
    reqData.input('endDate', sql.DateTime, end);
    reqData.input('statusSelected', sql.VarChar, safeStatus);

    // ========== EJECUTAR EN PARALELO ==========
    
    const [
      resultConductores,
      resultEquipos,
      resultTiempos,
      resultTiemposEnRegla,
      resultTotalRows,
      resultDataCompleta
    ] = await Promise.all([
      req1.query(queryConductores),
      req2.query(queryEquipos),
      req3.query(queryTiemposExcedidos),
      req4.query(queryTiemposEnRegla),
      reqTotalRows.query(queryTotalRows),
      reqData.query(queryDataCompleta),
    ]);

    const data = resultDataCompleta.recordset ?? [];
    const totalRows = Number(resultTotalRows.recordset?.[0]?.totalRows ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalRows / safePageSize));

    return {
      conductoresActivos: resultConductores.recordset?.[0]?.conductoresActivos ?? 0,
      equiposActivos: resultEquipos.recordset?.[0]?.equiposActivos ?? 0,
      cantTiemposExcedidos: resultTiempos.recordset?.[0]?.cantTiemposExcedidos ?? 0,
      tiempoEnRegla: resultTiemposEnRegla.recordset?.[0]?.tiempoEnRegla ?? 0,
      page: safePage,
      pageSize: safePageSize,
      totalRows,
      totalPages,
      data,
    };
  } catch (error) {
    console.error('Error en getReportsTeam: ', error);
    const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
    HandleError(code, error.message, 'querys/reports/getReportsTeam', error);
    throw new Error('Ha ocurrido un error al obtener los reportes del team');
  }
};
