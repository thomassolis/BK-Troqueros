import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateRequest } from '../../querys/requests/updateRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { GetSessionUserInfo } from '../../contexts/sessionContext.js';

export const Ctr_UpdRequest = async (req, res) => {
    try {        
        let request = req.body; // Obtiene la información de la petición
        const files = req.files; // Archivos enviados
        const userData = GetSessionUserInfo()     

        const idRequest = request.id_peticion[0];

        // Deserializar 'servicios' y 'paymentData' si es necesario
        if (request.servicios && typeof request.servicios === "string") {
            try {
                request.servicios = JSON.parse(request.servicios);
            } catch (e) {
                console.error("Error parseando servicios:", e);
                request.servicios = [];
            }
        }

        if (request.paymentData && typeof request.paymentData === "string") {
            try {
                request.paymentData = JSON.parse(request.paymentData);
            } catch (e) {
                request.paymentData = [];
            }
        }

        // Si 'paymentFiles' llega como string, convertirlo a un arreglo        
        if (request.paymentFiles && typeof request.paymentFiles === "string") {
            try {
                request.paymentFiles = JSON.parse(request.paymentFiles);
            } catch (e) {
                console.error("Error parseando paymentFiles:", e);
                request.paymentFiles = [];
            }
        }        
                        

        // Verifica que los archivos sean enviados correctamente                            

        // Realizar la actualización de la petición
        const updatedRequest = await UpdateRequest(request, idRequest, files, userData); // Actualiza los datos de la petición        
        // Valida que se haya actualizado la petición
        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Petición no actualizada.' });
        }
        
        return res.status(200).json({ success: true, message: 'Petición actualizada.' });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'controllers/requests/updateRequestController/Ctr_UpdRequest', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}
