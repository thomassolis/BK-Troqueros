import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

const schema = Joi.object({
    placa: Joi.string().trim().required(),
    numPoliza: Joi.string().empty('').allow(null).default(null),
    fechaExpedicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null).default(null),
    fechaCaducidad: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null).default(null),
    fechaRenovacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null).default(null),
    fechaUltRevisado: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null).default(null),
});

//Valida los datos enviados por el request body
export const ValidateDataInsertMiddleware = (req, res, next) => {
    try {
        const { error, value } = schema.validate(req.body);

        if (error) {
            console.log(error)
            return res.status(403).json({ success: false, message: 'Inserte bien los datos.' });
        }

        req.body = value;
        next();
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'middlewares/chassis_truckHead_truckVan/insertChassis.middleware/ValidateDataChassisMiddleware', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}