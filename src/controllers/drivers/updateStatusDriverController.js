import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateStatusDriver } from '../../querys/drivers/updateStatus.js';


export const Ctr_UpdateStatusDriver = async (req, res) => {
    try {
        const driver = req.body; // Obtenemos el status del conductor        
        // Valida que el status no sea undefined
        if (!driver) {
            return res.status(400).json({ success: false, message: 'Status no proporcionado' });
        }

        const updatedStatus = await UpdateStatusDriver(driver);

        if (!updatedStatus) {
            return res.status(400).json({ success: false, message: 'No se ha podido actualizar el status. Inténtelo más tarde.' });
        }

        return res.status(200).json({ success: true, message: 'Status Actualizado!' })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.CHASISES.PATCH);
        HandleError(code, error.message, 'controllers/drivers/updateStatusController/Ctr_UdpStatusChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}