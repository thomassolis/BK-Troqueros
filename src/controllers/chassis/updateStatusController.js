import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateStatusChassis } from '../../querys/Chassis/updateStatus.js';


export const Ctr_UdpStatusChassis = async (req, res) => {
    try {
        const chassis = req.body; // Obtenemos los datos
        console.log(chassis);

        // Validamos que chasis no sea undefined
        if (!chassis || !Object.keys(chassis).length) {
            return res.status(400).json({ success: false, message: 'Status no proporcionado' })
        }

        const updated = await UpdateStatusChassis(chassis) // Actualizamos el status

        // Validamos que se haya hecho la actualziación del status
        if (!updated) {
            return res.status(400).json({ success: false, message: 'Status no actualizado' })
        }

        return res.status(200).json({ success: true, message: 'Status actualizado' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.PATCH);
        HandleError(code, error.message, 'controllers/chassis/updateStatusController/Ctr_UdpStatusChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}