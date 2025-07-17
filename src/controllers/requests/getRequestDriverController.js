import { ValidateDate } from '../../auxiliary functions/dateConverter.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestDrivers } from '../../querys/requests/getRequestDrivers.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestsDrivers = async (req, res) => {
    try {
        let filters = req.query; // Obtiene la fecha y hora de salida de la petición
        
        const isValidDate = ValidateDate(filters); // Valida que la fecha sea una fecha valida

        if (!isValidDate) {
            return res.status(403).json({ success: false, message: isValid.msg });
        }
        
        const drivers = await GetRequestDrivers(filters); // Obtiene los conductores

        // Valida que conductores no sean undefined
        if (!drivers) {
            return res.status(404).json({ success: false, message: 'Conductor no encontrado. Inténtelo más tarde.' });
        }

        return res.status(200).json({ success: true, message: 'Data Enviada', data: drivers });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestDriversController/Ctr_GetRequestsDrivers', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}