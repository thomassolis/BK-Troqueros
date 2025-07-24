import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaServiceUpd } from '../../schema/schemaServices.js';


// Valida que los datos cumplan con el schema establecido
export const Mdlware_ValidateDataUpdService = (req, res, next) => {
    try {
        const data = req.body; // Obtiene la data del servicio

        // Valida si la data es undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' });
        }

        const { error, value } = schemaServiceUpd.validate(data); // Valida que los datos proporcionados cumplan con el esquema

        if (error) {
            return res.status(400).json({ success: true, message: error.message })
        }
        
        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.PUT)
        HandleError(code, error.message, 'middlewares/services/validateDataUpdate.middleware/Mdlware_ValidateDataUpdService', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información de la ruta del servicio. Intente más tarde' });
    }
}