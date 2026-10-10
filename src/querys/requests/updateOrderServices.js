import sql from '../../db/db.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdExtraCostsRequest } from './updateExtraCosts.js';
import { AddNewExtraCostsOrderSrvices } from './addExtraCost.js';

// Actualiza os datos de la petición
export const UpdOrderServiceRequest = async (transaction, services) => {
  try {
    const request = await transaction.request();
    let query = '';

    // Paso 1: Update Pedido_Servicio (ya sin monto)
    services.forEach((element, index) => {
      request.input(`IDPedidoServicio${index}`, sql.Int, element.id_pedidoServicio);
      request.input(`IDServicioDatos${index}`, sql.Int, element.id_servicio_datos);
      request.input(`Conductor${index}`, sql.VarChar, element.id_conductor);
      request.input(`Chasis${index}`, sql.VarChar, element.id_chasis || null);
      request.input(`Cabezal${index}`, sql.VarChar, element.id_cabezal);
      request.input(`Furgon${index}`, sql.VarChar, element.id_furgon || null);
      request.input(`EntregaVacio${index}`, sql.Bit, element.entrega_vacio || false);
      request.input(`FechaLimite${index}`, sql.VarChar, element.fecha_limite || null);
      request.input(`Comentario${index}`, sql.Text, element.comentario || '');
      request.input(`NumeroContenedor${index}`, sql.VarChar, element.numero_contenedor || '');
      request.input(`SizeContenedor${index}`, sql.VarChar, element.size_contenedor || '');
      request.input(`SH${index}`, sql.VarChar, element.sh || '');

      query += `
        UPDATE [Pedido_Servicio]
          SET 
            [id_conductor] = @Conductor${index},
            [id_chasis] = @Chasis${index},
            [id_cabezal] = @Cabezal${index},
            [id_furgon] = @Furgon${index},
            [entrega_vacio] = @EntregaVacio${index},
            [fecha_limite] = @FechaLimite${index},
            [comentario] = @Comentario${index},
            [num_contenedor] = @NumeroContenedor${index},
            [size_contenedor] = @SizeContenedor${index},
            [numero_referencia] = @SH${index}
        WHERE [id_Pedido_Servicio] = @IDPedidoServicio${index}
          AND [id_servicio_datos] = @IDServicioDatos${index};
      `;
    });

    await request.query(query);
    // Paso 2 y 3: Refrescar tarifas
    for (const service of services) {
      const idPedidoServicio = service.id_pedidoServicio;

      // 2.1 Eliminar tarifas viejas (opcional: podrías hacer soft-delete en vez de borrar)
      await transaction.request()
        .input("idPS", sql.Int, idPedidoServicio)
        .query(`
          DECLARE @PT_BORRAR TABLE (id INT PRIMARY KEY);

          INSERT INTO @PT_BORRAR(id)
          SELECT rel.id_precios_totales
          FROM pedido_servicio_precios_totales rel
          WHERE rel.id_Pedido_Servicio = @idPS;

          DELETE FROM pedido_servicio_precios_totales
          WHERE id_Pedido_Servicio = @idPS;

          DELETE pt
          FROM precios_totales pt
          WHERE pt.id_precios_totales IN (SELECT id FROM @PT_BORRAR)
            AND NOT EXISTS (
              SELECT 1 FROM pedido_servicio_precios_totales rel2
              WHERE rel2.id_precios_totales = pt.id_precios_totales
            );
        `);
      // 3. Insertar tarifas nuevas      
      for (const tarifa of service.tarifa || []) {
        const ptResult = await transaction.request()
          .input("costo", sql.Float, tarifa.costo || 0)
          .input("venta", sql.Float, tarifa.venta || 0)
          .input("descripcion", sql.VarChar, tarifa.descripcion || '')
          .query(`
            DECLARE @out TABLE (id INT);

            INSERT INTO precios_totales (costo, venta, descripcion)
            OUTPUT INSERTED.id_precios_totales INTO @out(id)
            VALUES (@costo, @venta, @descripcion);

            SELECT id FROM @out;
          `);
        const idPrecio = ptResult.recordset[0].id;
        await transaction.request()
          .input("idPS", sql.Int, idPedidoServicio)
          .input("idPT", sql.Int, idPrecio)
          .query(`
            INSERT INTO pedido_servicio_precios_totales (id_Pedido_Servicio, id_precios_totales)
            VALUES (@idPS, @idPT)
          `);
      }
    }
    return true;
  } catch (error) {
    const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
    console.error(error)
    HandleError(code, error.message, 'querys/requests/updateOrderServices/UpdOrderServiceRequest', error);
    throw new Error("Ha ocurrido un error al actualizar la información de los servicios");
  }
};
