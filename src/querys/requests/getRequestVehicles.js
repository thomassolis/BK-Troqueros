import { pool } from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const GetRequestChassis = async (filters) => {
  try {
    let values = [filters.fecha_salida, filters.hora_salida];
    let query = `
      WITH ServiciosPorChasis AS (
        SELECT 
          PS.id_chasis,
          P.fecha_salida,
          MIN(P.hora_salida) AS hora_salida,
          SUM(SD.tiempo_estimado) AS total_tiempo_estimado
        FROM Pedido_Servicio PS
        INNER JOIN Peticiones P ON P.id_peticion = PS.id_peticion
        INNER JOIN Servicios_datos SD ON SD.id_servicio_datos = PS.id_servicio_datos
        WHERE P.fecha_salida = $1
    `;

    if (filters.IdPeticion) {
      values.push(filters.IdPeticion);
      query += ` AND P.id_peticion <> $${values.length}`;
    }

    query += `
        GROUP BY PS.id_chasis, P.fecha_salida
      )
      SELECT 
        CH.id_chasis,
        CH.placa ||
        CASE
          WHEN SPCH.fecha_salida IS NOT NULL 
            AND $2::time <= (SPCH.hora_salida + (SPCH.total_tiempo_estimado || ' hour')::interval)
          THEN ' (' || to_char(SPCH.hora_salida, 'HH24:MI') || ' - ' ||
               to_char(SPCH.hora_salida + (SPCH.total_tiempo_estimado || ' hour')::interval, 'HH24:MI') || ')'
          ELSE ''
        END AS placa,
        CASE
          WHEN SPCH.fecha_salida = $1
            AND $2::time <= (SPCH.hora_salida + (SPCH.total_tiempo_estimado || ' hour')::interval)
          THEN 1 ELSE 0
        END AS success
      FROM Chasis CH
      LEFT JOIN ServiciosPorChasis SPCH ON SPCH.id_chasis = CH.id_chasis
      WHERE CH.status = 'Disponible' AND CH.active = true
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.CHASISES.GET);
    HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestChassis', error);
    throw new Error('Ha ocurrido un error al obtener los chasis en peticiones');
  }
};



// Obtiene los cabezal disponibles y activos del sistema
export const GetRequestTruckHead = async (filters) => {
  try {
    let values = [filters.fecha_salida, filters.hora_salida];
    let query = `
      WITH ServiciosPorCabezal AS (
        SELECT 
          PS.id_cabezal,
          P.fecha_salida,
          MIN(P.hora_salida) AS hora_salida,
          SUM(SD.tiempo_estimado) AS total_tiempo_estimado
        FROM Pedido_Servicio PS
        INNER JOIN Peticiones P ON P.id_peticion = PS.id_peticion
        INNER JOIN Servicios_datos SD ON SD.id_servicio_datos = PS.id_servicio_datos
        WHERE P.fecha_salida = $1
    `;

    if (filters.IdPeticion) {
      values.push(filters.IdPeticion);
      query += ` AND P.id_peticion <> $${values.length}`;
    }

    query += `
        GROUP BY PS.id_cabezal, P.fecha_salida
      )
      SELECT 
        CA.id_cabezal,
        CA.placa ||
        CASE
          WHEN SPCA.fecha_salida IS NOT NULL 
            AND $2::time <= (SPCA.hora_salida + (SPCA.total_tiempo_estimado || ' hour')::interval)
          THEN ' (' || to_char(SPCA.hora_salida, 'HH24:MI') || ' - ' ||
               to_char(SPCA.hora_salida + (SPCA.total_tiempo_estimado || ' hour')::interval, 'HH24:MI') || ')'
          ELSE ''
        END AS placa,
        CASE
          WHEN SPCA.fecha_salida = $1
            AND $2::time <= (SPCA.hora_salida + (SPCA.total_tiempo_estimado || ' hour')::interval)
          THEN 1 ELSE 0
        END AS success
      FROM Cabezal CA
      LEFT JOIN ServiciosPorCabezal SPCA ON SPCA.id_cabezal = CA.id_cabezal
      WHERE CA.status = 'Disponible' AND CA.active = true
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.CABEZALES.GET);
    HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestTruckHead', error);
    throw new Error('Ha ocurrido un error al obtener los cabezal en peticiones');
  }
};




// Obtiene los furgon disponibles y activos del sistema
export const GetRequestTruckVan = async (filters) => {
  try {
    let values = [filters.fecha_salida, filters.hora_salida];
    let query = `
      WITH ServiciosPorFurgon AS (
        SELECT 
          PS.id_furgon,
          P.fecha_salida,
          MIN(P.hora_salida) AS hora_salida,
          SUM(SD.tiempo_estimado) AS total_tiempo_estimado
        FROM Pedido_Servicio PS
        INNER JOIN Peticiones P ON P.id_peticion = PS.id_peticion
        INNER JOIN Servicios_datos SD ON SD.id_servicio_datos = PS.id_servicio_datos
        WHERE P.fecha_salida = $1
    `;

    if (filters.IdPeticion) {
      values.push(filters.IdPeticion);
      query += ` AND P.id_peticion <> $${values.length}`;
    }

    query += `
        GROUP BY PS.id_furgon, P.fecha_salida
      )
      SELECT 
        FU.id_furgon,
        FU.placa ||
        CASE
          WHEN SPFU.fecha_salida IS NOT NULL 
            AND $2::time <= (SPFU.hora_salida + (SPFU.total_tiempo_estimado || ' hour')::interval)
          THEN ' (' || to_char(SPFU.hora_salida, 'HH24:MI') || ' - ' ||
               to_char(SPFU.hora_salida + (SPFU.total_tiempo_estimado || ' hour')::interval, 'HH24:MI') || ')'
          ELSE ''
        END AS placa,
        CASE
          WHEN SPFU.fecha_salida = $1
            AND $2::time <= (SPFU.hora_salida + (SPFU.total_tiempo_estimado || ' hour')::interval)
          THEN 1 ELSE 0
        END AS success
      FROM Furgon FU
      LEFT JOIN ServiciosPorFurgon SPFU ON SPFU.id_furgon = FU.id_furgon
      WHERE FU.status = 'Disponible' AND FU.active = true
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.FURGONES.GET);
    HandleError(code, error.message, 'querys/requests/getRequestVehicles/GetRequestTruckVan', error);
    throw new Error('Ha ocurrido un error al obtener los furgon en peticiones');
  }
};

