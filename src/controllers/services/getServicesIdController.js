import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetServicesID } from '../../querys/services/getServicesID.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetServicesByID = async (req, res) => {
    try {
        const id = req.params.id; // Obtiene el ID del servicio

        // Valida que el identificador no sea undefined
        if (!id) {
            return res.status(401).json({ success: false, message: 'Ha ocurrido un error al obtener la información del servicio.' })
        }

        const service = await GetServicesID(id) // Obtiene la información un servicio

        // Valida que el service no sean undefined
        if (!service) {
            return res.status(200).json({success: false, message: 'Servicio no encontrado.'});
        }        

        return res.status(200).json({success: true, message: 'Data enviada', data: service});
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'services/getServicesController/Ctr_GetServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}