import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateStatusRequest } from '../../querys/requests/updStatusRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_UpdateStatusRequest = async (req, res) => {
    try {
        const request = req.body; // Obtiene la data
        console.log(request)

        // Validamos que peticion no sea undefined
        if (!request || !Object.keys(request).length) {
            return res.status(400).json({ success: false, message: 'Status no proporcionado' });
        }

        const updatedStatus = await UpdateStatusRequest(request); // Actualiza la petición

        // Valida que se haya actualizado el estado de la petición
        if (!updatedStatus) {
            return res.status(404).json({ success: false, message: 'Error al actualizar el estado de la petición.' });
        }

        return res.status(200).json({ success: true, message: 'Status Actualizado!' });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PATCH);
        HandleError(code, error.message, 'controllers/requests/updateStatusRequestsController/Ctr_UpdateStatusRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}