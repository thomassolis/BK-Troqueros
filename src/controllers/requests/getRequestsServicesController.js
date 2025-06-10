import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestServices } from '../../querys/requests/getRequestServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestsServices = async (req, res) => {
    try {
        const services = await GetRequestServices(); // Obtiene los servicios

        // Valida que los servicios no sean undefined
        if (!services) {
            return res.status(404).json({ success: false, message: 'Servicios no encontrados. Inténtelo más tarde.' });
        }

        return res.status(200).json({ success: true, message: 'Data Enviada', data: services });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestsServicesController/Ctr_GetRequestsServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}