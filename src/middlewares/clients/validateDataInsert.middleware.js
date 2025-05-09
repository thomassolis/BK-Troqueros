import Joi from "joi";
import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


const schemaClient = Joi.object({
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
    emailPersonaContacto: Joi.string().trim().max(200).allow(null, "").default("").messages({
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
    // Campos a quitar del schema
    nombrePersonaFinanciera: Joi.string().allow(null, "").default(""),
    telContactoFinanciero: Joi.string().allow(null, "").default(""),
    emailContactoFinanciero:Joi.string().allow(null, "").default(""),
})

export const MdlwareValidateDataInsertClient = (req, res, next) => {
    try {
        const data = req.body; // Obtenemo la data del nuevo cliente

        const { error, value } = schemaClient.validate(data)

        if (error) {
            return res.status(401).json({ success: true, message: error.message })
        }

        req.body = value
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTES, typeError.CLIENTES.POST);
        HandleError(code, error.message, 'middlewares/clients/validateDataInsert.middleware/MdlwareValidateDataInsertClient', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información. Intente más tarde' })
    }
}