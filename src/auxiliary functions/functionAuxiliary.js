
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
    const camposDeseados = ['precio', 'descripcion'];

    // Define los campos en común que usarás como clave compuesta
    const camposClave = ['id_conductor', 'id_chasis', 'id_cabezal', 'id_furgon'];

    // Función para construir una clave compuesta a partir de los campos clave
    const construirClave = (obj) => camposClave.map(c => obj[c]).join('|');

    // Crea un Map usando la clave compuesta como key
    const mapOriginales = new Map(
        arrayServices.map(item => [construirClave(item), item])
    );

    return arrayServicesInserted.map(item => {
        const clave = construirClave(item);
        const original = mapOriginales.get(clave) || {};

        const combinado = {
            id_Pedido_Servicio: item.id_Pedido_Servicio
        };

        camposDeseados.forEach(campo => {
            combinado[campo] = original[campo];
        });

        return combinado;
    });
};