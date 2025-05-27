import { HandleError } from '../../utils/HandleError.js'
import { GetTruckHead, GetTruckHeadByFilter } from '../../querys/TruckHead/getTruckHead.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los cabezales que hay en el sistema
export const CtrGetTruckHead = async (req, res) => {
    try {
        const search = req.query.search; //obtenemos la palabra a buscar
        const page = parseInt(req.query.page) || 1; // Obtiene el número de página

        let truckHead = null;

        // Valida si está filtrando
        if (search) {
            truckHead = await GetTruckHeadByFilter(page, search); //obtiene los cabezales filtrados
        } else {
            const truckHead = await GetTruckHead(page); //obtiene toda la data del cabezal
        }

        //valida que truckHead no sea nulo
        if (!truckHead) {
            return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', vehiculos: truckHead});
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'controllers/TruckHead/getTruckHeadController/CtrGetTruckHead', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}