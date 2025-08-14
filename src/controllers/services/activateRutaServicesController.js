import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateRutaService } from '../../querys/services/activateRutaServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_ActivateRutaService = async (req, res) => {
    try {
        const rutaService = req.body;

        // Validamos que los datos de la ruta del servicio no sea undefined
        if (!rutaService) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activetedServices = await ActivateRutaService(rutaService); // Habilita/Deshabilita la ruta del servicio

        // Valida que se haya activado/desactivado la ruta del servicio
        if (!activetedServices) {
            return res.status(401).json({ success: false, message: rutaService.active ? 'No se pudo habilitar la ruta del servicio.' : 'No se pudo deshabilitar la ruta del servicio.' })
        }

        return res.status(200).json({ success: true, message: rutaService.active ? 'Ruta del servicio habilitado.' : 'Ruta del servicio deshabilitado.' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PATCH);
        HandleError(code, error.message, 'services/activateRutaServicesController/Ctr_ActivateRutaService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}