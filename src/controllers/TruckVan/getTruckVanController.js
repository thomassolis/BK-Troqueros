import { HandleError } from '../../utils/HandleError.js';
import { GetTruckVan, GetTruckVanByFilter } from '../../querys/TruckVan/getTruckVan.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los furgones que hay en el sistema
export const CtrGetTruckVan = async (req, res) => {
    try {
        //obtenemos la palabra a buscar
        const search = req.query.search;
        // Obtiene el número de página (si no hay búsqueda, mantiene la paginación actual)
        const page = search ? 1 : parseInt(req.query.page) || 1;

        //Valida si ha ingresado una palabra a buscar
        if (search) {
            //obtiene los cabezales filtrados
            const truckVan = await GetTruckVanByFilter(1, search);

            //valida que los truckHead no sea nulo
            if (!truckVan) {
                return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
            }

            return res.status(200).json({success: true, message: 'Data enviada', vehiculos: truckVan});
        }

        //obtiene toda la data del furgones
        const truckVan = await GetTruckVan(page);

        //valida que no sea nulo
        if (!truckVan) {
            return res.status(200).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', vehiculos: truckVan});
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/TruckHead/getTruckVanController/CtrGetTruckVan', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}