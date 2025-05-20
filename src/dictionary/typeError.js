
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
    CLIENTS: {
        GET: "CLNE", //Cliente no encontrado
        POST: "CLNI", //Cliente no insertado
        PUT: "CLNA", //Cliente no actualizado
        DELETE: "CLNEL", //Cliente no eliminado
    },
    SUPPLIERS: {
        GET: "PRNE", //Proveedor no encontrado
        POST: "PRNI", //Proveedor no insertado
        PUT: "PRNA", //Proveedor no actualizado
        DELETE: "PRNEL", //Proveedor no eliminado
    },
    DRIVERS: {
        GET: "CONE", //Conductor no encontrado
        POST: "CONI", //Conductor no insertado
        PUT: "CONA", //Conductor no actualizado
        DELETE: "CONEL", //Conductor no eliminado
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
    validarFileExtension: "VFE",
    tokenNoProporcionado: "TNP",
}
