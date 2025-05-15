import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

const schema = Joi.object({
    id: Joi.string().required(),
    placa: Joi.string().trim().max(10).required().messages({
        'any.required': 'La placa es obligatoria.',
        'string.empty': 'La placa no puede estar vacía.',
        'string.max': 'La placa no puede tener más de 20 caracteres.',
    }),
    numPoliza: Joi.string().empty('').allow(null, "").default(""),
    fechaExpedicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    fechaCaducidad: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    fechaRenovacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    fechaUltRevisado: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
});

//valida los datos del request body
export const ValidateDataUpdateMiddleware = (req, res, next) => {
    console.log(req.body);
    try {
        const { error, value } = schema.validate(req.body);
        req.body = value
        console.log(error)
        if (error) {
            return res.status(403).json({ success: false, message: error.message });
        }

        req.body = value;
        next();
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'middlewares/chassis_truckHead_truckVan/updateChassis.middleware/UpdateChassisMiddleware', error);
        return res.status(500).json({success: false, message: 'Error al validar los datos'});
    }
}
