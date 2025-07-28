import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestRutaServices } from '../../querys/requests/getRequestRutaService.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestsRutaServices = async (req, res) => {
  try {
    const idService = req.params.id || null;

    const rutaServices = await GetRequestRutaServices(idService);

    if (!rutaServices || rutaServices.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron rutas disponibles.' });
    }

        return res.status(200).json({ success: true, message: 'Data Enviada', data: rutaServices });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestDataServiceController/Ctr_GetRequestsRutaServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}