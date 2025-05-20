import { HandleError } from '../../utils/HandleError.js';
import { UpdateChassis } from '../../querys/Chassis/updateChassis.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//controlador para actualizar los datos del chasis
export const CtrUpdateChassis = async (req, res) => {
    
    
    try {
        const dataChassis = req.body; //obtiene los datos del request body
        const files = req.files || {}; //obtiene todos los archivos del request files 
        
        console.log('chasis', dataChassis)
        console.log('files', files);

        //Actualiza el chasis
        const updatedChassis = await UpdateChassis(dataChassis, files);

        //valida que el chasis se haya actualzido
        if (!updatedChassis) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el chasis.'});
        }

        return res.status(200).json({success: true, message: 'Chasis actualizado.'});
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PUT);

        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/chassis/updateChassisController/CtrUpdateChassis', error);
            return res.status(500).json({success: false, message: error.message});
        }
        
        HandleError(code, error.message, 'controllers/chassis/updateChassisController/CtrUpdateChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}