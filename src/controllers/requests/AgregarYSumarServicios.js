function agruparYSumarServicios(peticion) {  

  peticion.forEach(item => {
    const serviciosSumados = {};

    // Recorremos los servicios de la petición
    item.services.forEach(servicio => {
      const idServicioUnico = servicio.Servicios_Unicos;

      // Si el servicio único ya existe, sumamos los valores de costo, venta y calculamos el profit
      if (serviciosSumados[idServicioUnico]) {
        serviciosSumados[idServicioUnico].costo += servicio.costo;
        serviciosSumados[idServicioUnico].venta += servicio.venta;
      } else {
        // Si no existe, inicializamos el servicio
        serviciosSumados[idServicioUnico] = { ...servicio }; // Copiar el servicio completo
      }
    });

    // Convertimos los valores de serviciosSumados a un array y calculamos el profit
    item.services = Object.values(serviciosSumados).map(servicio => {
      servicio.profit = servicio.venta - servicio.costo; // Calculamos el profit
      return servicio;
    });
  });

  return peticion;
}

export default agruparYSumarServicios;
