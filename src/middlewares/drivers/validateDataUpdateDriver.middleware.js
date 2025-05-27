import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaUpdDriver } from '../../schema/schemaDrivers.js';


export const Mdlware_ValidateDataUpdDriver = (req, res, next) => {
    try {
        const data = req.body; // Obtiene la data del conductor
        console.log(req.body);
        // Valida que los datos del conductor no sean undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = schemaUpdDriver.validate(data);

        if (error) {
            return res.status(400).json({ success: true, message: error.message })
        }
        
        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.PUT)
        HandleError(code, error.message, 'middlewares/drivers/validateDataUpdateDriver.middleware/Mdlware_ValidateDataUpdDriver', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información del conductor. Intente más tarde' });
    }
}