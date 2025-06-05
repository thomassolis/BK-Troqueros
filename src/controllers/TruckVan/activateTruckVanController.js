import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateTruckVan } from '../../querys/TruckVan/activateTruckVan.js';


export const Ctr_ActivateTruckVan = async (req, res) => {
    try {
        const id = req.params.id; // Obtenemos el ID del chasis

        // Validamos que el ID del furgon no sea undefined
        if (!id) {
            return res.status(400).json({ success: false, message: 'Identificador no proporcionado. Inténtelo más tarde.' })
        }

        const activated = await ActivateTruckVan(id) // Habilitamos el furgon

        // Validamos que se haya habilitado el furgon
        if (!activated) {
            return res.status(400).json({ success: false, message: 'No se pudo habilitar el furgon.' })
        }

        return res.status(200).json({ success: true, message: 'Furgon habilitado.' })
        
    } catch (error) {
        const code = GenerateCodeError(modules.FURGONES, typeError.FURGONES.PATCH);
        HandleError(code, error.message, 'controllers/TruckVan/activateTruckVanController/Ctr_ActivateTruckVan', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}