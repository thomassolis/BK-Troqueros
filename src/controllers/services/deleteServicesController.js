import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DeleteServices } from '../../querys/services/deleteServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_DeleteService = async () => {
    try {
        const idService = req.params.id
        
        // Valida que id del cliente exista
        if (!idService) {
            return res.status(401).json({ success: false, message: 'No se ha podido eliminar el servicio. Identificador no proporcionado' })
        }

        const deleted = await DeleteServices(idService);

        // Valida si el cliente ha sido eliminado
        if (!deleted) {
            return res.status(401).json({ success: false, message: 'Datos del servicio no encontrado' })
        }

        return res.status(200).json({ success: true, message: 'Datos del servicio eliminado satisfactoriamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'services/deleteServicesController/Ctr_DeleteService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}