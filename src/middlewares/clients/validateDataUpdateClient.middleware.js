import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


const schemaClient = Joi.object({
    id_cliente: Joi.string().required(),
    nombre: Joi.string().trim().max(50).required().messages({
      'string.empty': 'El nombre no puede estar vacío',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),
    ruc: Joi.string().trim().max(50).required().messages({
      'string.empty': 'El ruc no puede estar vacío',
      'string.max': 'El ruc no puede tener más de 50 caracteres',
      'any.required': 'El ruc es obligatorio'
    }),
    direccion: Joi.string().trim().max(200).allow(null, "").default("").messages({
      'string.max': 'La dirección no puede tener más de 200 caracteres'
    }),
    nombrePersonaContacto: Joi.string().trim().max(50).allow(null, "").default("").messages({
      'string.max': 'El nombre del contacto no puede tener más de 50 caracteres'
    }),
    telPersonaContacto: Joi.string().trim().max(20).allow(null, "").default("").messages({
      'string.max': 'El teléfono del contacto no puede tener más de 20 caracteres'
    }),
    emailPersonaContacto: Joi.string().trim().email().max(200).allow(null, "").default("").messages({
      'string.email': 'El correo electrónico no tiene un formato válido.',
      'string.max': 'El email del contato no puede tener más de 200 caracteres'
    }),
    numeroCuenta: Joi.string().trim().max(30).allow(null, "").default("").messages({
      'string.max': 'El numero de cuenta no puede tener más de 30 caracteres'
    }),
    nombreBanco: Joi.string().trim().max(50).allow(null, "").default("").messages({
      'string.max': 'El nombre del banco no puede tener más de 50 caracteres'
    }),
    tipoCuenta: Joi.string().trim().max(20).allow(null, "").default("").messages({
      'string.max': 'El tipo de cuenta no puede tener más de 20 caracteres'
    }),
    nombreCuenta: Joi.string().trim().max(50).allow(null, "").default("").messages({
      'string.max': 'El nombre de la cuenta no puede tener más de 50 caracteres'
    }),
})

// Valida los datos antes de actualizar la información del cliente
export const Mdlware_ValidateDataUpdateClient = (req, res, next) => {
    try {
        const { error, value } = schemaClient.validate(req.body) // Valida la data

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