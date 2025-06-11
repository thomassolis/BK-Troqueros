import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateTruckVan } from '../../querys/TruckVan/activateTruckVan.js';


export const Ctr_ActivateTruckVan = async (req, res) => {
    try {
        const truckvan = req.body;

        // Validamos que el furgon no sea undefined
        if (!truckvan) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activated = await ActivateTruckVan(truckvan) // Habilita/Deshabilita el furgon

        // Validamos que se haya habilitado/deshabilitado el furgon
        if (!activated) {
            return res.status(400).json({ success: false, message: truckvan.active ? 'No se pudo habilitar el furgon.' : 'No se pudo deshabilitar el furgon.' })
        }

        return res.status(200).json({ success: true, message: truckvan.active ? 'Furgon habilitado.' : 'Furgon deshabilitado.' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PATCH);
        HandleError(code, error.message, 'controllers/TruckVan/activateTruckVanController/Ctr_ActivateTruckVan', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}