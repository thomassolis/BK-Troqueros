import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DeleteRutaServices, DeleteServices } from '../../querys/services/deleteServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_DeleteService = async (req, res) => {
    try {
        const idService = req.params.id // Obtiene el ID del servicio
        
        // Valida que id del servicio exista
        if (!idService) {
            return res.status(401).json({ success: false, message: 'No se ha podido eliminar el servicio. Identificador no proporcionado' })
        }

        const deletedService = await DeleteServices(idService); // Elimina un servicio lógicamente

        // Valida si el servicio ha sido eliminado
        if (!deletedService) {
            return res.status(401).json({ success: false, message: 'Servicio no encontrado.' })
        }

        return res.status(200).json({ success: true, message: 'Servicio eliminado correctamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'services/deleteServicesController/Ctr_DeleteService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}



export const Ctr_DeleteRutaService = async (req, res) => {
    try {
        const idRutaService = req.params.id // Obtiene el ID de la ruta del servicio
        
        // Valida que id de la ruta del servicio exista
        if (!idRutaService) {
            return res.status(401).json({ success: false, message: 'No se ha podido eliminar el servicio. Identificador no proporcionado' })
        }

        const deletedService = await DeleteRutaServices(idRutaService); // Elimina una ruta del servicio lógicamente

        // Valida si la ruta del servicio ha sido eliminado
        if (!deletedService) {
            return res.status(401).json({ success: false, message: 'Ruta no encontrada.' })
        }

        return res.status(200).json({ success: true, message: 'Ruta eliminada correctamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.DELETE);
        HandleError(code, error.message, 'services/deleteServicesController/Ctr_DeleteRutaService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}