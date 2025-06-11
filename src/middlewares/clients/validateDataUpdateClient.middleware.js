import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaClientUpd } from '../../schema/schemaClients.js';

// Valida los datos antes de actualizar la información del cliente
export const Mdlware_ValidateDataUpdateClient = (req, res, next) => {
    try {
        const data = req.body; // Obtenemos los datos de los vehículos

        // Valida que los datos de los vehículos no sea undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = schemaClientUpd.validate(data) // Valida la data

        // Valida si hay un error al momento de validar la información del usuario
        if (error) {
            return res.status(401).json({ success: true, message: error.message })
        }

        req.body = value;
        next()
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.PUT);
        HandleError(code, error.message, 'middlewares/clients/validateDataUpdateClient.middleware/Mdlware_ValidateDataUpdateClient', error);
        return res.status(500).json({success: false, message: 'Ha ocurrido un error al validar los datos del cliente'});
    }
}