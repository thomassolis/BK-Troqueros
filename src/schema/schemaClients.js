import Joi from 'joi';

// Esquema para crear un cliente
export const schemaClient = Joi.object({
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


// Esquema para actualizar la información de un cliente
export const schemaClientUpd = schemaClient.keys({
    id_cliente: Joi.string().required().messages({
        'any.required': 'El identifcador es requerido.',
        'string.empty': 'El identificador no puede estar vacío'
    }),
});