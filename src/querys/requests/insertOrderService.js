import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { AddExtraCostsOrderServices } from './addExtraCost.js';

// Inserta los servicios de las peticiones
export const InsertOrderServices = async (client, services, idRequest) => {
  try {
    for (const service of services) {
      // 1. Insertar el Pedido_Servicio y obtener el ID
      const psQuery = `
        INSERT INTO Pedido_Servicio (
          id_servicio_datos, id_peticion, id_conductor, id_chasis, id_cabezal, id_furgon,
          entrega_vacio, fecha_limite, comentario,
          num_contenedor, size_contenedor, numero_referencia
        )
        VALUES ($1, $2, $3, $4, $5, $6,
                $7, $8, $9,
                $10, $11, $12)
        RETURNING id_pedido_servicio;
      `;

      const psValues = [
        service.id_servicio_datos,
        idRequest,
        service.id_conductor,
        service.id_chasis,
        service.id_cabezal,
        service.id_furgon,
        service.entrega_vacio || false,
        service.fecha_limite || null,
        service.comentario || '',
        service.numero_contenedor || '',
        service.size_contenedor || '',
        service.sh || ''
      ];

      const psResult = await client.query(psQuery, psValues);
      const idPedidoServicio = psResult.rows[0].id_pedido_servicio;

      // 2. Insertar todas las tarifas ligadas a este Pedido_Servicio
      for (const tarifa of service.tarifa || []) {
        const ptQuery = `
          INSERT INTO precios_totales (costo, venta, descripcion)
          VALUES ($1, $2, $3)
          RETURNING id_precios_totales;
        `;

        const ptValues = [
          tarifa.costo || 0,
          tarifa.venta || 0,
          tarifa.descripcion || ''
        ];

        const ptResult = await client.query(ptQuery, ptValues);
        const idPrecio = ptResult.rows[0].id_precios_totales;

        // 3. Insertar en la tabla puente
        const puenteQuery = `
          INSERT INTO pedido_servicio_precios_totales (id_pedido_servicio, id_precios_totales)
          VALUES ($1, $2)
        `;
        await client.query(puenteQuery, [idPedidoServicio, idPrecio]);
      }
    }

    return true;
  } catch (error) {
    console.error("❌ Error en InsertOrderServices:", error.message);
    const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.POST);
    HandleError(code, error.message, 'querys/requests/insertRequests/InsertOrderServices', error);
    throw new Error(`Ha ocurrido un error al insertar servicios de la petición ${idRequest}`);
  }
};
