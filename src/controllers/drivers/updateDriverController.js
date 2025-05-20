import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateDriverInfo } from '../../querys/drivers/updateDriver.js';


export const Ctr_UpdateDriver = async (req, res) => {
    try {
        const data = req.body; // Obtenemos la información del cliente
        const files = req.files || {}; // Obtenemos los archivos del cliente

        const updated = await UpdateDriverInfo(data, files) // Actualiza la información del conductor
        
        // Valida que se haya actualizado la información del cliente
        if (!updated) {
            return res.status(401).json({ success: false, message: 'No se ha podido actualizar la información del conductor. Inténtelo más tarde' })
        }

        return res.status(200).json({ success: true, message: 'La información del conductor ha sido actualizada' })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.PUT);

        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/drivers/updateDriverController/Ctr_UpdateDriver', error);
            return res.status(500).json({success: false, message: error.message});
        }
        
        HandleError(code, error.message, 'controllers/drivers/updateDriverController/Ctr_UpdateDriver', error);
        return res.status(500).json({ success: false, message: `${error.message}. Inténtelo más tarde` })
    }
}