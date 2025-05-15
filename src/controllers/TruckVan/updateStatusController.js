import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateStatusTruckVan } from '../../querys/TruckVan/updateStatus.js';


export const Ctr_UdpStatusTruckVan = async (req, res) => {
    try {
        const truckVan = req.body;

        if (!truckVan || !Object.keys(truckVan).length) {
            return res.status(400).json({ success: false, message: 'Status no proporcionado' })
        }

        const updated = await UpdateStatusTruckVan(truckVan) // Actualizamos el status

        if (!updated) {
            return res.status(400).json({ success: false, message: 'Status no actualizado' })
        }

        return res.status(200).json({ success: true, message: 'Status actualizado' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PATCH);
        HandleError(code, error.message, 'controllers/chassis/updateStatusController/Ctr_UdpStatusTruckVan', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}