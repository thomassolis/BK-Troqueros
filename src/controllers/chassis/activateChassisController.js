import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateChassis } from '../../querys/Chassis/activateChassis.js';


export const Ctr_ActivateChassis = async (req, res) => {
    try {
        const id = req.params.id; // Obtenemos el ID del chasis

        // Validamos que el ID del chasis no sea undefined
        if (!id) {
            return res.status(400).json({ success: false, message: 'Identificador no proporcionado. Inténtelo más tarde.' })
        }

        const activated = await ActivateChassis(id) // Habilitamos el chasis

        // Validamos que se haya habilitado el chasis
        if (!activated) {
            return res.status(400).json({ success: false, message: 'No se pudo habilitar el chasis.' })
        }

        return res.status(200).json({ success: true, message: 'Chasis habilitado' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PATCH);
        HandleError(code, error.message, 'controllers/chassis/activateChassisController/Ctr_ActivateChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}