import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertDriver } from '../../querys/drivers/insertDriver.js';


export const Ctr_InsertDriver = async (req, res) => {
    try {
        const newDriver = req.body; // Obtenemos los datos del conductor
        const files = req.files; // Obtenemos los archivos del conductor

        const created = await InsertDriver(newDriver, files);

        if (!created) {
            return res.status(401).json({ success: false, message: 'No se pudo crear el conductor' })
        }

        return res.status(201).json({ success: true, message: 'Conductor creado satisfactoriamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.POST);
        
        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/drivers/insertDriverController/Ctr_InsertDriver', error);
            return res.status(500).json({success: false, message: error.message});
        }

        HandleError(code, error.message, 'controllers/drivers/insertDriverController/Ctr_InsertDriver', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}