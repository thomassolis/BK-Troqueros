import { HandleError } from '../../utils/HandleError.js';
import { UpdateTruckHead } from '../../querys/TruckHead/updateTruckHead.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//controlador para actualizar los datos del cabezal
export const CtrUpdateTruckHead = async (req, res) => {
    try {
        const dataTruckHead = req.body; //obtiene los datos del request body
        const files = req.files || {}; //obtiene todos los archivos del request files
        
        //Actualiza el cabezal
        const updatedTruckHead = await UpdateTruckHead(dataTruckHead, files);

        //valida que el cabezal se haya actualzido
        if (!updatedTruckHead) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el Cabezal.'});
        }

        return res.status(200).json({success: true, message: 'Cabezal actualizado.'});
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PUT);

        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/TruckHead/updateTruckHeadController/CtrUpdateTruckHead', error);
            return res.status(500).json({success: false, message: error.message});
        }

        HandleError(code, error.message, 'controllers/TruckHead/updateTruckHeadController/CtrUpdateTruckHead', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}