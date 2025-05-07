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

        //valida que los datos no sean nulos
        if (!dataChassis) {
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //Actualiza el chasis
        const updatedChassis = await UpdateChassis(dataChassis, files);

        //valida que el chasis se haya actualzido
        if (!updatedChassis) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el chasis.'});
        }

        return res.status(200).json({success: true, message: 'Chasis actualizado.'});
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/chassis/updateChassisController/CtrUpdateChassis');
        return res.status(500).json({success: false, message: `${error.message}`});
    }
}