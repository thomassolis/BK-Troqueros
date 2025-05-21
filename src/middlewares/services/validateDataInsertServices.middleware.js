import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

const schemaService = Joi.object({
    id_servicio: Joi.alternatives().try(
        Joi.string(),
        Joi.number()
    ).allow(null, '').optional(),
    nombre_servicio: Joi.string().max(20).required().messages({
        'any.required': 'El campo nombre del servicio es requerido',
        'string.empty': 'El campo nombre del servicio no puede estar vacío',
        'string.max': 'El campo nombre del servicio no debe tener más de 20 caracteres.'
    }),
    datos_servicio: Joi.array().items(
        Joi.object({
            origen: Joi.string().trim().max(30).required().messages({
                'any.required': 'El campo lugar de salida es requerido',
                'string.empty': 'El campo lugar de salida no puede estar vacío',
                'string.max': 'El campo lugar de salida no debe tener más de 30 caracteres.'
            }),
            destino: Joi.string().trim().max(30).required().messages({
                'any.required': 'El campo lugar de llegada es requerido',
                'string.empty': 'El campo lugar de llegada no puede estar vacío',
                'string.max': 'El campo lugar de llegada no debe tener más de 30 caracteres.'
            }),
            tarifa: Joi.number().precision(2).required().messages({
                'any.required': 'El campo tarifa es requerido',
                'string.empty': 'El campo tarifa no puede estar vacío'
            })
        })
    ),    
});

// Valida que los datos cumplan con el schema establecido
export const Mdlware_ValidateDataInsertService = (req, res, next) => {
    try {
        const data = req.body; // Obtiene la data del servicio

        // Valida si la data es undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' });
        }

        const { error, value } = schemaService.validate(data); // Valida que los datos proporcionados cumplan con el esquema

        if (error) {
            return res.status(400).json({ success: true, message: error.message })
        }
        
        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.SERVICES, typeError.SERVICES.POST)
        HandleError(code, error.message, 'middlewares/services/validateDataInsertServices.middleware/Mdlware_ValidateDataInsertService', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información del servicio. Intente más tarde' });
    }
}