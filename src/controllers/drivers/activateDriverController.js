import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { ActivateDriver } from '../../querys/drivers/activateDriver.js';


export const Ctr_ActivateDriver = async (req, res) => {
    try {
        const driver = req.body;

        // Validamos que el conductor no sea undefined
        if (!driver || !Object.keys(driver).length) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activatedChassis = await ActivateDriver(driver) // Habilita/Deshabilita el conductor

        // Validamos que se haya habilitado/deshabilitado el conductor
        if (!activatedChassis) {
            return res.status(400).json({ success: false, message: driver.active ? 'No se pudo habilitar el conductor.' : 'No se pudo deshabilitar el conductor.' })
        }

        return res.status(200).json({ success: true, message: driver.active ? 'Conductor habilitado.' : 'Conductor deshabilitado.' })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, 'NH');
        HandleError(code, error.message, 'controllers/drivers/activateDriverController/Ctr_ActivateDriver', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}