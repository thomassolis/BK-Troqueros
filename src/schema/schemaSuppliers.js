import Joi from 'joi';


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


export const schemaSuppliersUpd = schemaSuppliers.keys({
    id_proveedor: Joi.string().trim().required().messages({
        'any.required': 'El identificador es requerido'
    })
})