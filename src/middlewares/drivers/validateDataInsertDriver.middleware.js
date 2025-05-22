import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaDriver } from '../../schema/schemaDrivers.js';


// Valida que los datos a insertar cumplan con el schema
export const Mdlware_ValidateDataInsertDriver = (req, res, next) => {
    try {
        const data = req.body;

        // Valida que los datos del conductor no sean undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = schemaDriver.validate(data);

        if (error) {
            return res.status(400).json({ success: true, message: error.message })
        }
        
        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.POST)
        HandleError(code, error.message, 'middlewares/drivers/validateDataInsertDriver.middleware/Mdlware_ValidateDataInsertDriver', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información del conductor. Intente más tarde' });
    }
}