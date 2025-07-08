import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DeleteServiceRequest } from '../../querys/requests/deleteServiceRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_DeleteServiceRequest = async (req, res) => {
    try {
        const idService = req.params.id; // Obtiene el ID del servicio a eliminar

        if (!idService) {
            return res.status(401).json({ success: false, message: 'El identificador del servicio es requerido.' });
        }

        const deletedService = await DeleteServiceRequest(idService); // Elimina el servicio de la petición

        // Valida que haya eliminado el servicio
        if (!deletedService) {
            return res.status(403).json({ success: false, message: 'servicio no encontrado.' });
        }

        return res.status(200).json({  success: true, message: 'Servicio eliminado correctamente.'})
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.DELETE);
        HandleError(code, error.message, 'controllers/requests/deleteServiceRequestController/Ctr_DeleteServiceRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde.` });
    }
}