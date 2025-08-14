import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DeleteDriver } from '../../querys/drivers/deleteDriver.js';


export const Ctr_DeleteDriver = async (req, res) => {
    try {
        const idDriver = req.params.id; // Obtiene el ID del conductor        
        // Valida que id del cliente exista
        if (!idDriver) {
            return res.status(401).json({ success: false, message: 'No se ha podido eliminar al conductor. Identificador no proporcionado' })
        }

        const deleted = await DeleteDriver(idDriver);

        // Valida si el cliente ha sido eliminado
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Conductor no encontrado' })
        }

        return res.status(200).json({ success: true, message: 'Conductor eliminado satisfactoriamnete!' })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.DELETE);
        HandleError(code, error.message, 'controllers/drivers/deleteDriverController/Ctr_DeleteDriver', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` });
    }
}