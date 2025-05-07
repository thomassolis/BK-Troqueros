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
        PATCH: "CHSN", // Status no actualizado (Chassis)
    },
    CABEZALES: {
        GET: "CANE", //Cabezal no encontrado
        POST: "CANI", //Cabezal no insertado
        PUT: "CANA", //Cabezal no actualizado
        DELETE: "CANE", //Cabezal no eliminado
        PATCH: "CASN", // Status no actualizado (Cabezal)
    },
    FURGONES: {
        GET: "FUNE", //Furgon no encontrado
        POST: "FUNI", //Furgon no insertado
        PUT: "FUNA", //Furgon no actualizado
        DELETE: "FUNEL", //Furgon no eliminado
        PATCH: "FUSN", // Status no actualizado (Furgon)
    },
    usuarioNoAutenticado: "UNA",
    usuarioNoEncontrado: "UNE",
    usuarioNoCreado: "UNC",
	duplicados: "DUP",
	serverNotResponde: "SNR",
    clienteNoEncontrado: "CNE",
    validarToken: "VTK",
    parametrosNoAgregados: "PNA",
    permisoDenegado: "PDN",
    general: "GEN",
    coneccionDB: "CDB",
    closeDB: "CLDB",
    LOGOUT: "CSS",
    validarCorreo: "VCO",
    insertarRol: "IRL",
    rutaNoEncontrada: "RNE",
}
