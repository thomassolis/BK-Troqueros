import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequests } from '../../querys/requests/getRequests.js'
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';



export const Ctr_GetRequests = async (req, res) => {
    try {
        const filters = req.query; // Obtiene los filtros

        const requests = await GetRequests(filters); // Obtiene las peticiones del sistema
        
        // Valida que las peticiones no sean undefined
        if (!requests) {
            return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
        }
        return res.status(200).json({success: true, message: 'Data enviada', data: requests});
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestsController/Ctr_GetRequests', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}