import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateService } from '../../querys/services/activateServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_ActivateRutaService = async (req, res) => {
    try {
        const service = req.body;

        // Validamos que los datos del servicio no sea undefined
        if (!service) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activetedServices = await ActivateService(service); // Habilita/Deshabilita el servicio

        // Valida que se haya activado/desactivado la ruta del servicio
        if (!activetedServices) {
            return res.status(401).json({ success: false, message: service.active ? 'No se pudo habilitar la ruta servicio.' : 'No se pudo deshabilitar la ruta servicio.' })
        }

        return res.status(200).json({ success: true, message: service.active ? 'Ruta del servicio habilitado.' : 'Ruta del servicio deshabilitado.' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PATCH);
        HandleError(code, error.message, 'services/activateRutaServicesController/Ctr_ActivateRutaService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}