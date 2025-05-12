import { HandleError } from '../../utils/HandleError.js';
import { UpdateTruckHead } from '../../querys/TruckHead/updateTruckHead.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//controlador para actualizar los datos del cabezal
export const CtrUpdateTruckHead = async (req, res) => {
    try {
        console.log(req.body)
        const dataTruckHead = req.body; //obtiene los datos del request body
        const files = req.files || {}; //obtiene todos los archivos del request files

        //valida que los datos no sean nulos
        if (!dataTruckHead) {
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //Actualiza el cabezal
        const updatedTruckHead = await UpdateTruckHead(dataTruckHead, files);

        //valida que el cabezal se haya actualzido
        if (!updatedTruckHead) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el Cabezal.'});
        }

        return res.status(200).json({success: true, message: 'Cabezal actualizado.'});
    } catch (error) {
        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            return res.status(500).json({success: false, message: error.msg});
        }
        
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/TruckHead/updateTruckHeadController/CtrUpdateTruckHead');
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}