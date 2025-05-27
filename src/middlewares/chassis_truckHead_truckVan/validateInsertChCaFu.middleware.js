import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaVehicles } from '../../schema/schemaVehiculo.js';

//Valida los datos enviados por el request body
export const ValidateDataInsertMiddleware = (req, res, next) => {
    console.log(req.body)
    console.log(req.files)
    try {
        const data = req.body; // Obtenemos los datos de los vehículos

        // Valida que los datos de los vehículos no sea undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = schemaVehicles.validate(data);

        if (error) {
            return res.status(403).json({ success: false, message: error.message });
        }

        req.body = value;
        next();
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'middlewares/chassis_truckHead_truckVan/validateInsertChCaFu.middleware/ValidateDataInsertMiddleware', error);
        return res.status(500).json({success: false, message: 'Ha ocurrido un error con la validación de los datos. Inténtelo más tarde.'});
    }
}