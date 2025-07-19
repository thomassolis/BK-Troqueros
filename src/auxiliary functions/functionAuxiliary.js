
// Agrupa las peticiones por servicios
export const GroupServicesByRequets = (requests) => {
    try {
        const requestGroup = new Map();

        for (const item of requests) {
            const id = item.id_peticion;

            if (!requestGroup.has(id)) {
                // Clonamos el objeto original y creamos el array vacio
                requestGroup.set(id, { ...item, services: [] });
            } else {
                requestGroup.get(id).services.push(item);
            }
        }

        return Array.from(requestGroup.values());
    } catch (error) {
        throw new Error(`Error al agrupar los servicios de las peticiones, ${error}`);        
    }
} 

// Construye el array para los costros extras por servicios
export const BuildArray = (arrayServices, arrayServicesInserted) => {
    // Define los campos en común que usarás como clave compuesta
    const camposClave = ['id_conductor', 'id_chasis', 'id_cabezal', 'id_furgon'];

    // Función para construir una clave compuesta a partir de los campos clave
    const construirClave = (obj) => camposClave.map(c => obj[c]).join('|');

    // Crea un Map usando la clave compuesta como key
    const mapOriginales = new Map(
        arrayServices.map(item => [construirClave(item), item])
    );

    const resultado = [];

    arrayServicesInserted.forEach(item => {
        const clave = construirClave(item);
        const original = mapOriginales.get(clave) || {};

        // Solo agregamos si el servicio tiene costos extras
        if (Array.isArray(original.costos_extras) && original.costos_extras.length > 0) {
            original.costos_extras.forEach(costo => {
                resultado.push({
                    id_Pedido_Servicio: item.id_Pedido_Servicio,
                    precio: costo.precio,
                    descripcion: costo.descripcion
                });
            });
        }
    });

    return resultado;
};

// Cambia la estructura del Objeto (Petición)
export const ChangeStructureRequest = (request) => {
    const primerRegistro = request[0];

    const estructura = {
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
        servicios: []
    };

    const serviciosMap = new Map();

    
    request.forEach(item => {
        const idServicio = item.id_Pedido_Servicio;

        // Si ya existe el servicio en el map, solo agregas costos extras si aplica
        if (serviciosMap.has(idServicio)) {
            const servicioExistente = serviciosMap.get(idServicio);

            if (item.id_Costos_Extras) {
                servicioExistente.costos_extras.push({
                    id_costos_extras: item.id_Costos_Extras,
                    precio: item.costoExtra,
                    descripcion: item.descripcion
                });
            }
        } else {
            // Construyes el servicio
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
                tarifa: item.tarifa,
            };

            // Si existe entrega_vacio y fecha_limite, los agregas
            if (item.entrega_vacio && item.fecha_limite) {
                servicio.entrega_vacio = item.entrega_vacio;
                servicio.fecha_limite = item.fecha_limite;
            }

            // Si tiene costos extras, inicializas el array
            if (item.id_Costos_Extras) {
                servicio.costos_extras = [{
                    id_costos_extras: item.id_Costos_Extras,
                    precio: item.costoExtra,
                    descripcion: item.descripcion
                }];
            }

            serviciosMap.set(idServicio, servicio);
        }
    });

    // Al final, conviertes el map a array
    estructura.servicios = Array.from(serviciosMap.values());

    return estructura;
}


// Obtiene el precio total de los servicios
export const GetTotalPricePerService = (services) => {
    try {
        // Valida que el servicio sea un array
        if (!Array.isArray(services)) {
            return 0; // De lo contrario retorna 0
        }

        let monto = 0;

        // Suma las tarifas de los servicios
        // Obtiene el monto total de los servicios solicitados
        // Suma los costos extras
        for (const item of services || []) {
            monto += (item.tarifa ? item.tarifa : 0);
            
            // Suma los precios de los costos extras si existen
            if (Array.isArray(item.costos_extras)) {
                for (const costo of item.costos_extras) {
                    monto += (costo.precio ? costo.precio : 0);
                }
            }

            if (Array.isArray(item.nuevos_costos_extras)) {
                for (const costo of item.nuevos_costos_extras) {
                    monto += (costo.precio ? costo.precio : 0);
                }
            }
        }

        return monto;
    } catch (error) {
        throw new Error(`Error al obtener el total de los costos extras, ${error}`);        
    }
}

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