import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const schemaDriver = Joi.object({
    nombre: Joi.string().trim().max(20).required().messages({
        'any.required': 'El campo nombre es requerido.',
        'string.empty': 'El campo nombre no debe estar vacío.',
        'string.max': 'El campo nombre no debe contener más de 20 caracteres.'
    }),
    apellido: Joi.string().trim().max(20).allow(null, '').default('').messages({
        'string.max': 'El campo apellido no debe contener más de 20 caracteres.'
    }),
    cedula: Joi.string().trim().max(20).required('').messages({
        'any.required': 'El campo cedula es requerido.',
        'string.empty': 'El campo cedula no debe estar vacío.',
        'string.max': 'El campo cedula no debe contener más de 20 caracteres.'
    }),
    email: Joi.string().trim().email().max(50).allow(null, '').default('').messages({
        'string.email': 'El correo electrónico no tiene un formato válido.',
        'string.max': 'El campo email no debe contener más de 50 caracteres.'
    }),
    pass: Joi.string().trim().max(20).allow(null, '').default('').messages({
        'string.max': 'El campo contraseña no debe contener más de 20 caracteres.'
    }),
    telefono: Joi.string().trim().max(20).allow(null, '').default('').messages({
        'string.max': 'El campo telefono no debe contener más de 20 caracteres.'
    }),
    status: Joi.string().trim().max(20).allow(null, '').default('Disponible'),
})


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