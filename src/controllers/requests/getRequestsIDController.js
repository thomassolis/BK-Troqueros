import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequests } from '../../querys/requests/getRequests.js'
import { GetRequestByID } from '../../querys/requests/getRequestsById.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';



export const Ctr_GetRequestsByID = async (req, res) => {
    try {
        const idRequest = req.params.id; // Obtiene el ID de la petición

        // Valida que el ID no sea undefined
        if (!idRequest) {
            return res.status(200).json({success: false, message: 'Ha ocuriido un error al obtener la petición. Identificador no proporcionado. Intente más tarde'});
        }

        const requests = await GetRequestByID(idRequest); // Obtiene la petición por ID

        // Valida que las peticiones no sean undefined
        if (!requests) {
            return res.status(200).json({success: false, message: 'Petición no encontrada o no existe.'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: requests});
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestsIDController/Ctr_GetRequestsByID', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}