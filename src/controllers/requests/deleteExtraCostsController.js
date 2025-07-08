import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DeleteExtraCostsRequest } from '../../querys/requests/deleteExtraCostsRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_DeleteExtraCostsRequest = async (req, res) => {
    try {
        const idExtraCost = req.params.id; // Obtiene el ID del servicio de la petición

        // Valida si el ID del servicio es undefined o ''
        if (!idExtraCost) {
            return res.status(401).json({ success: false, message: 'El identificador del costo extra es requerido.' });
        }

        const deletedService = await DeleteExtraCostsRequest(idExtraCost); // Elimina el servicio de la petición

        // Valida que haya eliminado el servicio
        if (!deletedService) {
            return res.status(403).json({ success: false, message: 'Costo extra no encontrado.' });
        }

        return res.status(200).json({  success: true, message: 'Costo extra eliminado correctamente.'})
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.DELETE);
        HandleError(code, error.message, 'controllers/requests/deleteExtraCostsController/Ctr_DeleteExtraCostsRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde.` });
    }
}