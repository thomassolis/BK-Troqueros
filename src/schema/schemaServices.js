import Joi from 'joi';

const schemaBaseItem = Joi.object({
    lugar_origen: Joi.string().trim().max(30).required().messages({
        'any.required': 'El campo lugar de salida es requerido',
        'string.empty': 'El campo lugar de salida no puede estar vacío',
        'string.max': 'El campo lugar de salida no debe tener más de 30 caracteres.'
    }),
    lugar_destino: Joi.string().trim().max(30).required().messages({
        'any.required': 'El campo lugar de llegada es requerido',
        'string.empty': 'El campo lugar de llegada no puede estar vacío',
        'string.max': 'El campo lugar de llegada no debe tener más de 30 caracteres.'
    }),
    tarifa: Joi.number().precision(2).required().messages({
        'any.required': 'El campo tarifa es requerido',
        'string.empty': 'El campo tarifa no puede estar vacío'
    })
});

// Esquema para actualizar la ruta de un servicio
export const schemaDataServicesUpd = schemaBaseItem.keys({
    id_servicio_datos: Joi.number().required().messages({
        'any.required': 'El identificador del dato del servicio es requerido.'
    })
});

// Esquema base para crear un servicio
export const schemaService = Joi.object({
    nombre_servicio: Joi.string().max(100).required().messages({
        'any.required': 'El campo nombre del servicio es requerido',
        'string.empty': 'El campo nombre del servicio no puede estar vacío',
        'string.max': 'El campo nombre del servicio no debe tener más de 100 caracteres.'
    }),
    datos_servicio: Joi.array().items(schemaBaseItem).default([]),    
});

// Esquema para agregar una nueva ruta del servicio
export const schemaDataServices = schemaBaseItem.keys({
    id_servicio: Joi.number().required().messages({
        'any.required': 'El identificador del servicio es requerido.'
    }),
});

export const schemaServiceUpd = schemaService
  .fork(['datos_servicio'], (schema) => schema.forbidden())
  .keys({
    id_servicio: Joi.number().required().messages({
        'any.required': 'El identificador del servicio es requerido.'
    }),
});