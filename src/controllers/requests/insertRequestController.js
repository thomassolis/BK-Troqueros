import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertNewRequest } from '../../querys/requests/insertRequest.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_InsertRequest = async (req, res) => {
    try {
        const request = req.body; // Obtiene la data de la petición 
        const files = req.files;                
        if (request.servicios && typeof request.servicios === "string") {  
            try{
                request.servicios = JSON.parse(request.servicios);
            }catch(e){
                console.error("Error parseando servicios:", e);
                request.servicios = [];
            }            
        }

        if (request.paymentData && typeof request.paymentData === "string") {
            try{
                request.paymentData = JSON.parse(request.paymentData);
            }catch(e){
                request.paymentData = [];
            }                        
        }


        const createdRequest = await InsertNewRequest(request, files); // Crea la petición
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