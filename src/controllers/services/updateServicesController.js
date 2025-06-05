import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateDataServices } from '../../querys/services/updateServices.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_UpdateServices = async (req, res) => {
    try {
        const data = req.body; // Obtiene la data del servicio

        const updatedServices = await UpdateDataServices(data);

        // Valida que se haya actualizado la información del servicio
        if (!updatedServices) {
            return res.status(401).json({ success: false, message: 'No se ha podido actualizar la información del servicio. Inténtelo más tarde' })
        }

        return res.status(200).json({ success: true, message: 'Servicio actualizado satisfactoriamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PUT);
        HandleError(code, error.message, 'services/updateServicesController/Ctr_UpdateServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}