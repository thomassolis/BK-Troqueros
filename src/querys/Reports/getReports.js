import { pool } from "../../db/db.js";
import sql from 'mssql'
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
                            from preciosTotales pt
                            left join pedidoServicio_preciosTotales pp on pp.id_preciosTotales = pt.id_preciosTotales
                            left join Pedido_Servicio ps on ps.id_Pedido_Servicio = pp.id_Pedido_Servicio
                            left join Peticiones P on P.id_peticion = ps.id_peticion
                            left join Servicios_datos sd on sd.id_servicio_datos = ps.id_servicio_datos
                            ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
                        `                    
        const result2 = await reports.query(query2);

        //Ventas totales de las peticiones

        const query3 = `select 
                            sum (pt.venta) as ventatotal
                            from preciosTotales pt
                            left join pedidoServicio_preciosTotales pp on pp.id_preciosTotales = pt.id_preciosTotales
                            left join Pedido_Servicio ps on ps.id_Pedido_Servicio = pp.id_Pedido_Servicio
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
                c.nombre as 'Nombre_de_cliente'
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
            SELECT TOP (5)     
                sd.[lugar_origen],
                sd.[lugar_destino],          
                SUM(pt.venta) as total_venta,
                COUNT(DISTINCT ps.id_Pedido_Servicio) as total_pedidos
            FROM [TroquerosProduccion].[dbo].[Servicios_datos] sd
                LEFT JOIN Pedido_Servicio ps ON ps.id_servicio_datos = sd.id_servicio_datos
                left join Peticiones P on P.id_peticion = ps.id_peticion
                LEFT JOIN pedidoServicio_preciosTotales PSPT ON PSPT.id_Pedido_Servicio = ps.id_Pedido_Servicio
                LEFT JOIN preciosTotales PT ON PT.id_preciosTotales = PSPT.id_preciosTotales
                ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
            GROUP BY 
                sd.id_servicio_datos,
                sd.id_servicio,
                sd.lugar_origen,
                sd.lugar_destino
            ORDER BY total_venta DESC;
        `;

        const result5 = await reports.query(query5);

        // Organizar los datos de ambos reportes
        const reportsData = {
            bestCustomers: result4.recordset.map(row => ({
                peticiones: row.peticiones,
                nombreDeCliente: row.Nombre_de_cliente,
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
            graphData: reportsData
        };

    }catch(error){
        console.error('Error en getReports: ', error);
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'querys/reports/getReports', error);
        throw new Error('Ha ocurrido un error al obtener los reportes');
    }    
}