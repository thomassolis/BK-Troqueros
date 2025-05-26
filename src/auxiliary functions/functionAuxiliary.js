
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