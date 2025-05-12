import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateStatusTruckHead } from '../../querys/TruckHead/updateStatus.js';


export const Ctr_UdpStatusTruckHead = async (req, res) => {
    try {
        const truckHead = req.body;

        if (!truckHead) {
            return res.status(400).json({ success: false, message: 'Error al actualizar el furgon' })
        }

        const updated = await UpdateStatusTruckHead(truckHead) // Actualizamos el status

        if (!updated) {
            return res.status(400).json({ success: false, message: 'Status no actualizado' })
        }

        return res.status(200).json({ success: true, message: 'Status actualizado' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.PATCH);
        HandleError(code, error.message, 'controllers/chassis/updateStatusController/Ctr_UdpStatusTruckHead', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}