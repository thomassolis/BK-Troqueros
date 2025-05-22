import Joi from 'joi';


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
});


export const schemaUpdDriver = schemaDriver.keys({
    id_conductor: Joi.string().required().messages({
        'any.required': 'El identificador es requerido'
    })
});