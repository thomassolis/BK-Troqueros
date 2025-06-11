import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestChassis, GetRequestTruckHead, GetRequestTruckVan } from '../../querys/requests/getRequestVehicles.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestsVehicles = async (req, res) => {
    try {
        const chassis = await GetRequestChassis(); // Obtiene los chasis
        const truckhead = await GetRequestTruckHead(); // Obtiene los cabezal
        const truckvan = await GetRequestTruckVan(); // Obtiene los furgon

        // Valida que conductores no sean undefined
        if (!chassis || !truckhead || !truckvan) {
            return res.status(404).json({ success: false, message: 'Vehículos no encontrado. Inténtelo más tarde.' });
        }

        const vehicles = {
            chassis,
            truckhead,
            truckvan
        };

        return res.status(200).json({ success: true, message: 'Data Enviada', data: vehicles });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.vehiculoNoEncontrado);
        HandleError(code, error.message, 'controllers/requests/getRequesVehiclesController/Ctr_GetRequestsVehicles', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}