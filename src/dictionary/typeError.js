/* 
    ************************************************************************************
    *                                                                                  *
    *                        DICCIONARIO DE TIPO DE ERRORES                            *
    *                                                                                  *
    ************************************************************************************
*/
export const typeError = {
    CHASISES: {
        GET: "CHNE", //Chasis no encontrado
        POST: "CHNI", //Chasis no insertado
        PUT: "CHNA", //Chasis no actualizado
        DELETE: "CHNE", //Chasis no eliminado
    },
    CABEZALES: {
        GET: "CANE", //Cabezal no encontrado
        POST: "CANI", //Cabezal no insertado
        PUT: "CANA", //Cabezal no actualizado
        DELETE: "CANE", //Cabezal no eliminado
    },
    usuarioNoAutenticado: "UNA",
    usuarioNoEncontrado: "UNE",
	duplicados: "DUP",
	serverNotResponde: "SNR",
	file: "FIL",
    clienteNoEncontrado: "CNE",
    validarToken: "VTK",
    parametrosNoAgregados: "PNA",
    permisoDenegado: "PDN",
    general: "GEN",
}
