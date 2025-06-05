import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdRutaService } from '../../querys/services/updateRutaServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_UpdRutaService = async (req, res) => {
    try {
        const rutaService = req.body; // Obtiene la data del servicio

        const updateRutaService = await UpdRutaService(rutaService); // Actualiza la ruta del servicio

        if (!updateRutaService) {
            return res.status(401).json({ success: false, message: 'No se ha podido actualizar la ruta del servicio. Inténtelo más tarde' })
        }

        return res.status(200).json({ success: true, message: 'Ruta actualizada satisfactoriamente!' })

    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PUT);
        HandleError(code, error.message, 'services/updateRutaServicesController/Ctr_UpdRutaService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}