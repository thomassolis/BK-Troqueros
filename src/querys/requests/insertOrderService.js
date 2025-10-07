import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { AddExtraCostsOrderServices } from './addExtraCost.js';

// Inserta los servicios de las peticiones
//Modificado
export const InsertOrderServices = async (transaction, services, idRequest) => {
  try {
    for (const service of services) {
      // 1. Insertar el Pedido_Servicio
      const psResult = await transaction.request()
        .input("id_servicio_datos", sql.Int, service.id_servicio_datos)
        .input("id_peticion", sql.VarChar, idRequest)
        .input("id_conductor", sql.VarChar, service.id_conductor)
        .input("id_chasis", sql.VarChar, service.id_chasis)
        .input("id_cabezal", sql.VarChar, service.id_cabezal)
        .input("id_furgon", sql.VarChar, service.id_furgon)
        .input("entrega_vacio", sql.Bit, service.entrega_vacio || false)
        .input("fecha_limite", sql.Date, service.fecha_limite || null)
        .input("comentario", sql.Text, service.comentario || '')
        .input("num_contenedor", sql.VarChar, service.numero_contenedor || '')
        .input("size_contenedor", sql.VarChar, service.size_contenedor || '')
        .input("numero_referencia", sql.VarChar, service.sh || '')
        .query(`
          INSERT INTO Pedido_Servicio (
            id_servicio_datos, id_peticion, id_conductor, id_chasis, id_cabezal, id_furgon,
            entrega_vacio, fecha_limite, comentario,
            num_contenedor, size_contenedor, numero_referencia
          )
          OUTPUT INSERTED.id_Pedido_Servicio AS id
          VALUES (
            @id_servicio_datos, @id_peticion, @id_conductor, @id_chasis, @id_cabezal, @id_furgon,
            @entrega_vacio, @fecha_limite, @comentario,
            @num_contenedor, @size_contenedor, @numero_referencia
          )
        `);

      const idPedidoServicio = psResult.recordset[0].id;

      // 2. Insertar todas las tarifas ligadas a este Pedido_Servicio
      for (const tarifa of service.tarifa || []) {
        const ptResult = await transaction.request()
          .input("costo", sql.Float, tarifa.costo || 0)
          .input("venta", sql.Float, tarifa.venta || 0)
          .input("descripcion", sql.VarChar, tarifa.descripcion || '')
          .query(`
            INSERT INTO preciosTotales (costo, venta, descripcion)
            OUTPUT INSERTED.id_preciosTotales AS id
            VALUES (@costo, @venta, @descripcion)
          `);

        const idPrecio = ptResult.recordset[0].id;

        // 3. Insertar en la tabla puente
        await transaction.request()
          .input("idPS", sql.Int, idPedidoServicio)
          .input("idPT", sql.Int, idPrecio)
          .query(`
            INSERT INTO pedidoServicio_preciosTotales (id_Pedido_Servicio, id_preciosTotales)
            VALUES (@idPS, @idPT)
          `);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Error en InsertOrderServices:", error.message);
    throw new Error(`Ha ocurrido un error al insertar servicios de la petición ${idRequest}`);
  }
};
