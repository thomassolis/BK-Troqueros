import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetServicesID } from '../../querys/services/getServicesID.js';
import { InsertDataServices } from '../../querys/services/insertServicesInfo.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


// Controlador para insertar un servicio
export const Ctr_InsertServices = async (req, res) => {
    try {
        const service = req.body; // Obtiene la data del servicio

        const created = await InsertDataServices(service);

        // Valida que se haya creado el servicio
        if (!created) {
            return res.status(401).json({ success: false, message: 'No se pudo crear el servicio' })
        }

        return res.status(201).json({ success: true, message: 'Servicio creado satisfactoriamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'services/insertServicesController/Ctr_InsertServices', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}