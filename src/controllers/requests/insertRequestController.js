import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertNewRequest } from '../../querys/requests/insertRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_InsertRequest = async (req, res) => {
    try {
        const request = req.body; // Obtiene la data de la petición
        console.log('request',request);
        const createdRequest = await InsertNewRequest(request); // Crea la petición

        // Valida que se haya creado la petición en el sistema
        if (!createdRequest) {
            return res.status(400).json({success: false, message: 'No se pudo crear la petición.'});
        }

        return res.status(201).json({success: true, message: 'Petición creada satisfactoriamente!.'});
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        console.error(error);
        HandleError(code, error.message, 'controllers/requests/insertRequestsController/Ctr_InsertRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}