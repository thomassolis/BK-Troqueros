import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestRutaServices } from '../../querys/requests/getRequestRutaService.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestsRutaServices = async (req, res) => {
    try {
        const idService = req.params.id; // Obtiene el ID del servicio

        // Valida que los servicios no sean undefined
        if (!idService || !Object.keys(idService).length) {
            return res.status(400).json({ success: false, message: 'Identificador no porporcionado. Inténtelo más tarde.' });
        }

        const rutaServices = await GetRequestRutaServices(idService); // Obtiene las rutas de los servicios por ID

        if (!rutaServices) {
            return res.status(404).json({ success: false, message: 'Ruta no encontrada para el servicio seleccionada.' });
        }

        return res.status(200).json({ success: true, message: 'Data Enviada', data: rutaServices });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestDataServiceIDController/Ctr_GetRequestsDataServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}