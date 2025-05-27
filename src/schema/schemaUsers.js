import Joi from 'joi';


export const userSchema = Joi.object({
    nombre: Joi.string().trim().min(3).max(50).required().messages({
        'any.required': 'El campo nombre es requerido.',
        'string.min': 'El campo nombre solo acepta minimo 3 caracteres.',
        'string.min': 'El campo nombre no puede tener más de 50 caracteres.',
        'string.empty': 'El campo nombre no puede estar vacío.'
    }),
    apellido: Joi.string().trim().min(3).max(50).required().messages({
        'any.required': 'El campo apellido es requerido.',
        'string.min': 'El campo apellido solo acepta minimo 3 caracteres.',
        'string.min': 'El campo apellido no puede tener más de 50 caracteres.',
        'string.empty': 'El campo apellido no puede estar vacío.'
    }),
    email: Joi.string().email().trim().max(50).required().messages({
      'string.email': 'El correo electrónico no tiene un formato válido.',
      'string.max': 'El email del contato no puede tener más de 50 caracteres'
    }),
    pass: Joi.string().required().messages({
        'any.required': 'El campo contraseña es requerido.',
        'string.empty': 'El campo contraseña no debe estar vació.'
    }),
    rol: Joi.string().length(3).required().messages({
        'any.required': 'El campo rol es requerido.',
        'string.empty': 'El campo rol no debe estar vació.'
    }),
});