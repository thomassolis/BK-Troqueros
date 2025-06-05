
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { InsertNewDataServices } from '../../querys/services/insertServicesInfo.js';


export const Ctr_InsertInfoService = async (req, res) => {
    try {
        const infoService = req.body; // Obtiene la información del servicio
        
        const added = await InsertNewDataServices(infoService); // Agrega una nueva ruta al servicio

        // Valida que se haya creado la ruta del servicio
        if (!added) {
            return res.status(401).json({ success: false, message: 'No se pudo crear la ruta del servicio' })
        }

        return res.status(201).json({ success: true, message: 'Ruta del servicio creado satisfactoriamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST);
        HandleError(code, error.message, 'services/addInfoServicesController/Ctr_InsertInfoService', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}