import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetAllServices, GetServicesByFilter } from '../../querys/services/getServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetServices = async (req, res) => {
    try {
        //obtenemos la palabra a buscar, sino existe se le asigna una cadena vacía
        const search = req.query.search;
        // Obtiene el número de página (si no hay búsqueda, mantiene la paginación actual)
        const page = search ? 1 : parseInt(req.query.page) || 1;

        let services = null;

        if (search) {
            services = await GetServicesByFilter(page, search); // Obtiene los servicios filtrados
        } else {
            services = await GetAllServices(page); // Obtiene todos los servicios
        }

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