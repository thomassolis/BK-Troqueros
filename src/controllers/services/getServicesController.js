import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetServices } from '../../querys/services/getServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetServices = async (req, res) => {
    try {
        const filters = req.query; // Obtiene los filtros de busqueda

        const services = await GetServices(filters); // Obtiene los servicios del sistema

        // Valida que los services no sean undefined
        if (!services) {
            return res.status(200).json({success: false, message: 'No se encontraron resultados'});
        }        

        return res.status(200).json({success: true, message: 'Data enviada', data: services});
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.GET);
        HandleError(code, error.message, 'services/getServicesController/Ctr_GetServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}