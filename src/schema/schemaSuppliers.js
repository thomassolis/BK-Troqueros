import Joi from 'joi';

// Esquema para agregar un proveedor
export const schemaSuppliers = Joi.object({
    nombre: Joi.string().trim().max(20).required().messages({
        'any.required': 'El campo nombre es requerido.',
        'string.max': 'El campo nombre no puede tener más de 20 caracteres.',
        'string.empty': 'El campo nombre no puede estar vacío.'
    }),
    personaContacto: Joi.string().trim().max(50).allow(null, '').default("").messages({
        'string.max': 'El campo persona contacto no puede tener más de 50 caracteres.',
    }),
    celular: Joi.string().trim().max(20).allow(null, '').default("").messages({
        'string.max': 'El campo celular no puede tener más de 20 caracteres.',
    }),
    telefono: Joi.string().trim().max(20).allow(null, '').default("").messages({
        'string.max': 'El campo telefono no puede tener más de 20 caracteres.',
    }),
    email: Joi.string().trim().email().max(50).allow(null, '').default("").messages({
        'string.email': 'El correo electrónico no tiene un formato válido.',
        'string.max': 'El email del contacto no puede tener más de 50 caracteres.',
    }),
    numeroYappy: Joi.string().trim().max(15).allow(null, '').default("").messages({
        'string.max': 'El campo numero yappy no puede tener más de 15 caracteres.',
    }),
    nombreCuenta: Joi.string().trim().max(100).allow(null, '').default("").messages({
        'string.max': 'El campo nombre de cuenta no puede tener más de 100 caracteres.',
    }),
    numeroCuenta: Joi.string().trim().max(50).allow(null, '').default("").messages({
        'string.max': 'El campo numero de cuenta no puede tener más de 50 caracteres.',
    }),
    tipoBanco: Joi.string().trim().max(20).allow(null, '').default("").messages({
        'string.max': 'El campo tipo de banco no puede tener más de 20 caracteres.',
    }),
});

// Esquema para actualizar la información de un proveedor
export const schemaSuppliersUpd = schemaSuppliers.keys({
    id_proveedor: Joi.string().trim().required().messages({
        'any.required': 'El identificador es requerido'
    })
})