import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateChassis } from '../../querys/Chassis/activateChassis.js';


export const Ctr_ActivateChassis = async (req, res) => {
    try {
        const chassis = req.body;

        // Validamos que el chasis no sea undefined
        if (!chassis) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activatedChassis = await ActivateChassis(chassis) // Habilita/Deshabilita el chasis

        // Validamos que se haya habilitado/deshabilitado el chasis
        if (!activatedChassis) {
            return res.status(400).json({ success: false, message: chassis.active ? 'No se pudo habilitar el chasis.' : 'No se pudo deshabilitar el chasis.' })
        }

        return res.status(200).json({ success: true, message: chassis.active ? 'Chasis habilitado.' : 'Chasis deshabilitado.' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PATCH);
        HandleError(code, error.message, 'controllers/chassis/activateChassisController/Ctr_ActivateChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}