import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateTruckHead } from '../../querys/TruckHead/activateTruckHead.js';


export const Ctr_ActivateTruckhead = async (req, res) => {
    try {
        const truckHead = req.body;

        // Validamos que el cabezal no sea undefined
        if (!truckHead) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activatedTruckHead = await ActivateTruckHead(truckHead) // Habilita/Deshabilita el cabezal

        // Validamos que se haya habilitado/deshabilitado el cabezal
        if (!activatedTruckHead) {
            return res.status(400).json({ success: false, message: truckHead.active ? 'No se pudo habilitar el cabezal.' : 'No se pudo deshabilitar el cabezal.' })
        }

        return res.status(200).json({ success: true, message: truckHead.active ? 'Cabezal habilitado.' : 'Cabezal deshabilitado.' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PATCH);
        HandleError(code, error.message, 'controllers/TruckHead/activateTruckHeadController/Ctr_ActivateTruckhead', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}