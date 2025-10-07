import path from 'path';
import fs from "fs";
import { GetLinksDownloadFiles } from '../fileManager/getFiles.js';

// Agrupa las peticiones por servicios
export const GroupServicesByRequets = (rows) => {
  
  try {
    const byPeticion = new Map();

    for (const r of rows) {
      // 1) Crear el objeto padre si no existe
      let parent = byPeticion.get(r.id_peticion);
      if (!parent) {
        parent = {
          id_peticion: r.id_peticion,
          id_cliente: r.cliente_id ?? null,
          id_proveedor: r.proveedor_id ?? null,
          cliente: r.nombre_cliente ?? null,
          proveedor: r.proveedor ?? null,
          monto: r.monto_peticion ?? null,
          precio_proveedor: r.precio_proveedor ?? null,
          profit: r.profit ?? 0,
          fecha_salida: r.fecha_salida ?? null,
          hora_salida: r.hora_salida ?? null,
          numero_factura: r.numero_factura ?? null,
          status: r.status ?? null,
          services: [],
          paymentData: [],
          files: []
        };
        byPeticion.set(r.id_peticion, parent);
      }

      // 2) Verificar si ya existe el servicio (por id_Pedido_Servicio)
      let service = parent.services.find(s => s.id_Pedido_Servicio === r.id_Pedido_Servicio);
      if (!service) {
        service = {
          id_peticion: parent.id_peticion, // Redundante pero pedido
          cliente: parent.cliente,         // Redundante pero pedido
          numero_factura: r.numero_factura ?? null,
          id_Pedido_Servicio: r.id_Pedido_Servicio,
          servicio: r.servicio ?? null,
          lugar_origen: r.lugar_origen ?? null,
          lugar_destino: r.lugar_destino ?? null,
          conductor: r.conductor ?? null,
          chasis: r.chasis ?? null,
          cabezal: r.cabezal ?? null,
          furgon: r.furgon ?? null,
          tarifa: [], // Aquí guardamos las tarifas de cada servicio
          comentario: r.comentario ?? '',
          numero_contenedor: r.numero_contenedor ?? '',
          size_contenedor: r.size_contenedor ?? '',
          sh: r.sh ?? '',
          id_proveedor: r.proveedor_id ?? null,
          proveedor: r.proveedor ?? null,
          precio_proveedor: r.precio_proveedor ?? null,
          fecha_salida: r.fecha_salida ?? null,
          hora_salida: r.hora_salida ?? null,
          status: r.status ?? null,
          // Inicializamos los totales por servicio
          costo: 0,
          venta: 0,
          profit: 0
        };
        parent.services.push(service);
      }

      // 3) Sumar las tarifas por servicio
      const costo = Number(r.costo) || 0;
      const venta = Number(r.venta) || 0;
      const profit = venta - costo;

      // Añadimos la tarifa a la lista del servicio
      service.tarifa.push({
        costo,
        descripcion: service.tarifa.length === 0 ? 'Movimiento' : String(service.tarifa.length + 1),  // Incremental
        profit,
        venta
      });

      // Sumamos los valores al servicio
      service.costo += costo;
      service.venta += venta;
      service.profit += profit;
    }

    return Array.from(byPeticion.values());
  } catch (error) {
    throw new Error(`Error al agrupar los servicios de las peticiones: ${error}`);
  }
};




// Construye el array para los costros extras por servicios
export const BuildArray = (arrayServices, arrayServicesInserted) => {
    
  // Campos para la clave base
  const camposClave = ['id_conductor', 'id_chasis', 'id_cabezal', 'id_furgon'];

  // Normaliza valores para evitar 'undefined' o 'null' en la clave
  const norm = (v) => (v === undefined || v === null ? '' : String(v).trim());

  // Construye clave base determinista
  const construirClave = (obj) => camposClave.map(c => norm(obj[c])).join('|');    
  // 1) Construimos un MultiMap: clave -> cola (array) de originales con esa clave
  const colaPorClave = new Map();
  for (const original of arrayServices || []) {
    const clave = construirClave(original);
    if (!colaPorClave.has(clave)) colaPorClave.set(clave, []);
    colaPorClave.get(clave).push(original);
  }

  const resultado = [];

  // 2) Recorremos los insertados y consumimos uno de la cola por cada coincidencia
  for (const item of (arrayServicesInserted || [])) {
    const clave = construirClave(item);
    const cola = colaPorClave.get(clave);

    // Si no hay original disponible para esta clave, saltamos
    if (!cola || cola.length === 0) continue;

    // Tomamos el siguiente original (FIFO) para hacer el emparejamiento único
    const originalEmparejado = cola.shift();

    // Si tiene costos extras, los agregamos
    if (Array.isArray(originalEmparejado?.costos_extras) && originalEmparejado.costos_extras.length > 0) {
      for (const costo of originalEmparejado.costos_extras) {
        resultado.push({
          id_Pedido_Servicio: item.id_Pedido_Servicio,
          precio: costo.precio,
          descripcion: costo.descripcion
        });
      }
    }
  }

  return resultado;
};


// Cambia la estructura del Objeto (Petición)
// Cambia la estructura del Objeto (Petición) incluyendo los datos de pago
// ChangeStructureRequest
export const ChangeStructureRequest = (request, req) => {    

  //Variables for link images
  const protocol = req.protocol;
  const host = req.get('host');
  const linkDownload = `${protocol}://${host}/api/preview/Peticiones/comprobantes`;
  const id = request?.[0]?.id_peticion;  

  const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

  // ✅ Defensivo: si viene vacío, devuelve estructura mínima
  if (!Array.isArray(request) || request.length === 0) {
    return {
      id_peticion: null,
      id_cliente: null,
      id_proveedor: null,
      cliente: null,
      proveedor: null,
      monto: null,
      precio_proveedor: null,
      profit: 0,
      fecha_salida: null,
      hora_salida: null,
      numero_factura: null,
      servicios: [],
      paymentData: [],
      files: [],
    };
  }

  const primerRegistro = request[0];  

  const estructura = {
    // Si no quieres espacios en el id_peticion del payload, usa trim() aquí también:
    // id_peticion: String(primerRegistro.id_peticion).trim(),
    id_peticion: primerRegistro.id_peticion,
    id_cliente: primerRegistro.id_cliente,
    id_proveedor: primerRegistro.id_proveedor,
    cliente: primerRegistro.cliente,
    proveedor: primerRegistro.proveedor,
    monto: primerRegistro.monto,
    precio_proveedor: primerRegistro.precio_proveedor,
    profit: primerRegistro.profit,
    fecha_salida: primerRegistro.fecha_salida,
    hora_salida: primerRegistro.hora_salida,
    numero_factura: primerRegistro.numero_factura,
    servicios: [],
    paymentData: [],
    files: [],
  };

  const serviciosMap = new Map();
  const pagosMap = new Map(); // Agrupa pagos por combinación única

  // --- Helpers para tarifas ---
  const hasTarifaData = (it) => {
    // Considera 0 como válido; solo descartamos null/undefined y string vacío
    const hasDesc = (it.descripcion ?? "") !== "";
    const hasCosto = it.costo !== null && it.costo !== undefined;
    const hasVenta = it.venta !== null && it.venta !== undefined;
    return hasDesc || hasCosto || hasVenta;
  };

  const makeTarifa = (it) => ({
    costo: Number(it.costo) || 0,
    descripcion: it.descripcion ?? "",
    profit: Number(it.profit) || 0,
    venta: Number(it.venta) || 0,
  });

  const tarifaKey = (t) => `${t.costo}|${t.venta}|${t.descripcion ?? ""}`;

  // ----------------------------
  // Recorrido fila a fila
  // ----------------------------
  request.forEach((item) => {
    const idServicio = item.id_Pedido_Servicio;

    // --- Pagos (solo si hay algún dato) ---
    if (item.descripcionDePago || item.montoPagado || item.referenciaBancaria) {
      const pagoKey = `${item.descripcionDePago}-${item.montoPagado}-${item.referenciaBancaria}`;
      if (!pagosMap.has(pagoKey)) {
        pagosMap.set(pagoKey, {
          descripcionDePago: item.descripcionDePago,
          montoPagado: item.montoPagado,
          referenciaBancaria: item.referenciaBancaria,
        });
      }
    }

    if (serviciosMap.has(idServicio)) {
      // --- Servicio existente: acumular valores ---
      const s = serviciosMap.get(idServicio);

      // Acumular tarifas si hay datos en esta fila
      if (hasTarifaData(item)) {
        const t = makeTarifa(item);
        s.__tarifaSet ??= new Set(s.tarifa?.map(tarifaKey) ?? []);
        const key = tarifaKey(t);
        if (!s.__tarifaSet.has(key)) {
          s.tarifa.push(t);
          s.__tarifaSet.add(key);
        }
      }

      // Costos extras (si existieran)
      if (item.id_Costos_Extras) {
        s.costos_extras ??= [];
        s.costos_extras.push({
          id_costos_extras: item.id_Costos_Extras,
          precio: item.costoExtra,
          descripcion: item.descripcion,
        });
      }
    } else {
      // --- Crear el servicio la primera vez ---
      const servicio = {
        id_pedidoServicio: item.id_Pedido_Servicio,
        id_servicio_datos: item.id_servicio_datos,
        id_servicio: item.id_servicio,
        servicio: item.servicio,
        lugar_origen: item.lugar_origen,
        lugar_destino: item.lugar_destino,
        id_conductor: item.id_conductor,
        id_chasis: item.id_chasis,
        id_cabezal: item.id_cabezal,
        id_furgon: item.id_furgon,
        conductor: item.conductor,
        chasis: item.chasis,
        cabezal: item.cabezal,
        furgon: item.furgon,
        tarifa: [], // <-- siempre array; iremos acumulando
        comentario: item.comentario,
        numero_contenedor: item.numero_contenedor,
        size_contenedor: item.size_contenedor,
        sh: item.sh,
      };

      // Sembrar la tarifa de la primera fila si existen datos
      if (hasTarifaData(item)) {        
        const t = makeTarifa(item);
        servicio.tarifa.push(t);
        servicio.__tarifaSet = new Set([tarifaKey(t)]);
      }

      // entrega_vacio + fecha_limite (mantengo tu condición original)
      if (item.entrega_vacio && item.fecha_limite) {
        servicio.entrega_vacio = item.entrega_vacio;
        servicio.fecha_limite = item.fecha_limite;
      }

      // Costos extras (si existieran)
      if (item.id_Costos_Extras) {
        servicio.costos_extras = [
          {
            id_costos_extras: item.id_Costos_Extras,
            precio: item.costoExtra,
            descripcion: item.descripcion,
          },
        ];
      }

      serviciosMap.set(idServicio, servicio);
    }
  });

  // ----------------------------
  // Archivos por petición (server-side)
  // ----------------------------

  try {
    const files_path = path.join(
      process.cwd(),
      "src",
      "adjuntos",
      "Peticiones",
      "comprobantes"
    );

    // Para carpeta usas id_peticion sin espacios (como ya hacías):            

    const idPeticionFolder = String(primerRegistro.id_peticion).trim();
    const requestFolder = path.join(files_path, idPeticionFolder);

    if (fs.existsSync(requestFolder)) {

      const baseUrl = getBaseUrl(req);
    
      // Una sola llamada: obtienes todos los links de esa carpeta
      const links = GetLinksDownloadFiles(linkDownload, id, "Peticiones");

      // Luego, al armar cada file:
      estructura.files = fs.readdirSync(requestFolder).map((fileName) => {
        const fullPath = path.join(requestFolder, fileName);
        const stats = fs.statSync(fullPath);

        // Buscar el link correspondiente a este archivo
        const link = links.find((l) => l.name === fileName);

        return {
          nombre: fileName,
          ruta: link?.url ?? null,                  // ✅ ahora es string único
          url: link?.url ?? null,                   // si quieres mantener "url"
          size: stats.size,
          fecha_subida: stats.birthtime.toISOString(),
          tipo: path.extname(fileName).slice(1),
        };
      });

    }
  } catch (e) {
    console.warn("⚠️ Error leyendo archivos de la petición:", e?.message);
  }

  // ----------------------------
  // Convertir mapas a arrays y limpiar artefactos
  // ----------------------------
  estructura.servicios = Array.from(serviciosMap.values()).map((s) => {
    if (s.__tarifaSet) delete s.__tarifaSet;
    // Si quieres ordenar tarifas por descripción / venta, descomenta:
    // s.tarifa?.sort((a, b) => String(a.descripcion).localeCompare(String(b.descripcion)));
    return s;
  });

  estructura.paymentData = Array.from(pagosMap.values());



  return estructura;
};


// Obtiene el precio total de los servicios
// Obtiene el precio total de los servicios
export const GetTotalPricePerService = (services) => {

  try {
    if (!Array.isArray(services)) {
      return 0;
    }

    let monto = 0;

    for (const item of services || []) {
      if (Array.isArray(item.tarifa)) {
        // Sumar todas las ventas de la tarifa
        for (const t of item.tarifa) {
          monto += Number(t.venta) || 0;
        }
      } else {
        // Retrocompatibilidad: si tarifa es un número
        monto += Number(item.tarifa) || 0;
      }
    }

    return monto;
  } catch (error) {
    throw new Error(`Error al obtener el total de tarifas, ${error}`);
  }
};


// Verifica que si hay una entrega vacio con la misma fecha de inicio
export const OrganizeEmptyDeliveryDates = (array) => {
    // objeto vacio
    const fechas = {};

    return array.map(item => {
        let cant = 1; // Suma las cantidades que se repite una misma fecha
        const auxDate = item.start; // Obtiene la hora inicial del servicio

        // Valida si la fecha está incluida dentro de la lista
        if (auxDate in fechas) {
            cant += fechas[auxDate];
        }

        // Convertir a objeto Date y sumar minutos
        const endDate = new Date(auxDate);
        endDate.setMinutes(endDate.getMinutes() + (cant * 30));

        fechas[auxDate] = cant; // Guarda la cantidad de repeticiones de esa fecha

        return {
            ...item,
            start: item.start.toISOString().replace('T', ' ').substring(0, 19),
            end: endDate.toISOString().replace('T', ' ').substring(0, 19)
        };  
    });
}