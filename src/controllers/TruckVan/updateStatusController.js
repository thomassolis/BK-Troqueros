import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateStatusTruckVan } from '../../querys/TruckVan/updateStatus.js';


export const Ctr_UdpStatusTruckVan = async (req, res) => {
    try {
        const truckVan = req.body;

        if (!truckVan) {
            return res.status(400).json({ success: false, message: 'Error al actualizar el furgon' })
        }

        const updated = await UpdateStatusTruckVan(truckVan) // Actualizamos el status

        if (!updated) {
            return res.status(400).json({ success: false, message: 'Status no actualizado' })
        }

        return res.status(200).json({ success: true, message: 'Status actualizado' })
        
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/chassis/updateChassisController/CtrUpdateChassis');
        return res.status(500).json({success: false, message: `${error.message}`});
    }
}