import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestClients } from '../../querys/requests/getRequestClients.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestClients = async (req, res) => {
    try {
        const clients = await GetRequestClients(); // Obtiene los clientes

        // Valida que los clientes no sean undefined
        if (!clients) {
            return res.status(404).json({ success: false, message: 'Clientes no encontrados. Inténtelo más tarde.' });
        }

        return res.status(200).json({ success: true, message: 'Data Enviada', data: clients });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestClientsController/Ctr_GetRequestClients', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}