import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateRequest } from '../../querys/requests/updateRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_UpdRequest = async (req, res) => {
    try {
        const request = req.body; // Obtiene la información de la petición
        const updatedRequest = await UpdateRequest(request) // Actualiza los datos de la petición

        // Valida que se haya actualizado la petición
        if (!updatedRequest) {
            return res.status(404).json({ success: true, message: 'Petición no actualziada.' });
        }

        return res.status(200).json({ success: true, message: 'Petición actualizada.' })
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'controllers/requests/updateRequestController/Ctr_UpdRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}