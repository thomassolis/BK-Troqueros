import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const schemaSuppliers = Joi.object({
    nombre: Joi.string().trim().max(20).required().messages({
        'any.required': 'El campo nombre es requerido.',
        'string.max': 'El nombre no puede tener más de 20 caracteres.',
        'string.empty': 'El campo nombre no puede estar vacío.'
    }),
    personaContacto: Joi.string().trim().max(50).allow(null, '').default("").messages({
        'string.max': 'El nombre no puede tener más de 50 caracteres.',
    }),
    celular: Joi.string().trim().max(20).allow(null, '').default("").messages({
        'string.max': 'El nombre no puede tener más de 20 caracteres.',
    }),
    telefono: Joi.string().trim().max(20).allow(null, '').default("").messages({
        'string.max': 'El nombre no puede tener más de 20 caracteres.',
    }),
    email: Joi.string().trim().email().max(50).allow(null, '').default("").messages({
        'string.email': 'El correo electrónico no tiene un formato válido.',
        'string.max': 'El email del contacto no puede tener más de 50 caracteres.',
    }),
    numeroCuenta: Joi.string().trim().max(50).allow(null, '').default("").messages({
        'string.max': 'El nombre no puede tener más de 50 caracteres.',
    }),
    tipoBanco: Joi.string().trim().max(20).allow(null, '').default("").messages({
        'string.max': 'El nombre no puede tener más de 20 caracteres.',
    }),
});

//Valida los datos enviados por el request body
export const ValidateDataSuppliersMiddleware = (req, res, next) => {
    try {
        const data = req.body; // Obtiene la data del conductor
        
        // Valida que los datos del conductor no sean undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        //Valida que los datos cumplan con el esquema establecido
        const { error, value } = schemaSuppliers.validate(data);

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.POST)
        HandleError(code, error.message, 'middlewares/suppliers/insertSuppliers.middleware/ValidateDataSuppliersMiddleware', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información. Intente más tarde' })
    }
}