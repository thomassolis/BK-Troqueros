import { HandleError } from '../../utils/HandleError.js';
import { UpdateTruckVan } from '../../querys/TruckVan/updateTruckVan.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';

//controlador para actualizar los datos del furgon
export const CtrUpdateTruckVan = async (req, res) => {
    try {
        const dataTruckVan = req.body; //obtiene los datos del request body
        const files = req.files || {}; //obtiene todos los archivos del request files
        
        //Actualiza el furgon
        const updatedTruckVan = await UpdateTruckVan(dataTruckVan, files);

        //valida que el furgon se haya actualzido
        if (!updatedTruckVan) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el furgon.'});
        }

        return res.status(200).json({success: true, message: 'Furgon actualizado.'});
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PUT);

        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/TruckVan/updateTruckVanController/CtrUpdateTruckVan', error);
            return res.status(500).json({success: false, message: error.message});
        }

        HandleError(code, error.message, 'controllers/TruckVan/updateTruckVanController/CtrUpdateTruckVan', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}