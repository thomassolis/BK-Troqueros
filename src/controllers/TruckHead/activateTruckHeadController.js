import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateTruckHead } from '../../querys/TruckHead/activateTruckHead.js';


export const Ctr_ActivateTruckhead = async (req, res) => {
    try {
        const id = req.params.id; // Obtenemos el ID del chasis

        // Validamos que el ID del cabezal no sea undefined
        if (!id) {
            return res.status(400).json({ success: false, message: 'Identificador no proporcionado. Inténtelo más tarde.' })
        }

        const activated = await ActivateTruckHead(id) // Habilitamos el cabezal

        // Validamos que se haya habilitado el cabezal
        if (!activated) {
            return res.status(400).json({ success: false, message: 'No se pudo habilitar el cabezal.' })
        }

        return res.status(200).json({ success: true, message: 'Cabezal habilitado.' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PATCH);
        HandleError(code, error.message, 'controllers/TruckHead/activateTruckHeadController/Ctr_ActivateTruckhead', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}