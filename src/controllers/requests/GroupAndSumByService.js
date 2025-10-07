export const GroupAndSumByService = (dataRequest) => {
    try {
        const groupedData = []; // Aquí vamos a almacenar los resultados agrupados

        // Recorremos todos los registros
        dataRequest.forEach(r => {
            // Buscamos si ya existe el servicio en el array agrupado
            let existingEntry = groupedData.find(entry => entry.id_Pedido_Servicio === r.id_Pedido_Servicio);
            
            // Si no existe, lo creamos
            if (!existingEntry) {
                existingEntry = {
                    ID: r.ID,
                    cliente: r.cliente,
                    servicio: r.servicio,
                    'Lugar de Origen': r['Lugar de Origen'],
                    'Lugar de Destino': r['Lugar de Destino'],
                    conductor: r.conductor ?? 'No Asignado',
                    chasis: r.chasis ?? 'No Asignado',
                    cabezal: r.cabezal ?? 'No Asignado',
                    furgon: r.furgon ?? 'No Asignado',
                    SH: r.SH ?? '',
                    'Número de Contenedor': r['Número de Contenedor'] ?? '',
                    'Tamaño de Contenedor': r['Tamaño de Contenedor'] ?? '',
                    monto: r.monto ?? null,
                    'Creación de Petición': r['Creación de Petición'],
                    'Comienzo de Petición': r['Comienzo de Petición'],
                    'Nombre Proveedor': r['Nombre Proveedor'] ?? null,
                    'Costo de Proveedor': r['Costo de Proveedor'] ?? 0,
                    profit: 0, // Inicializamos en 0
                    comentario: r.comentario ?? '',
                    'Número de Factura': r['Número de Factura'] ?? null,
                    costo: 0, // Inicializamos en 0
                    venta: 0, // Inicializamos en 0
                    status: r.status ?? 'En espera',
                    id_Pedido_Servicio: r.id_Pedido_Servicio
                };
                groupedData.push(existingEntry);  // Lo agregamos al array de resultados
            }

            // Sumar los valores de cada servicio (costo, venta, profit)
            const costo = Number(r.costo) || 0;
            const venta = Number(r.venta) || 0;
            const profit = venta - costo;

            // Sumar al servicio
            existingEntry.costo += costo;
            existingEntry.venta += venta;
            existingEntry.profit += profit;
        });

        return groupedData;
    } catch (error) {
        console.error('Error al agrupar y sumar los servicios:', error);
        throw new Error('Error al agrupar y sumar los servicios');
    }
};
