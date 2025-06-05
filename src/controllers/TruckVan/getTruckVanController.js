import { HandleError } from '../../utils/HandleError.js';
import { GetTruckVan, GetTruckVanByFilter } from '../../querys/TruckVan/getTruckVan.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los furgones que hay en el sistema
export const CtrGetTruckVan = async (req, res) => {
    try {
        const search = req.query.search; // Obtenemos la palabra a buscar
        const page = parseInt(req.query.page) || 1; // Obtiene la página actual
        let active = req.query.active ? req.query.active : true;
        active = active === 'true' || active === true

        let truckVan = null;

        // Valida si está filtrando
        if (search) {
            truckVan = await GetTruckVanByFilter(page, search, active); //obtiene los cabezales filtrados
        } else {
            truckVan = await GetTruckVan(page, active); //obtiene toda la data del furgones
        }

        //valida que no sea nulo
        if (!truckVan) {
            return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', vehiculos: truckVan});
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.GET);
        HandleError(code, error.message, 'controllers/TruckHead/getTruckVanController/CtrGetTruckVan', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}