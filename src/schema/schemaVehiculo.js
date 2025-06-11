import Joi from 'joi';

// Esquema para agregar un vehiculo
export const schemaVehicles = Joi.object({
    placa: Joi.string().trim().max(20).required().messages({
        'any.required': 'La placa es obligatoria.',
        'string.empty': 'La placa no puede estar vacía.',
        'string.max': 'La placa no puede tener más de 20 caracteres.',
    }),
    status: Joi.string().trim().allow(null, "").default("No Disponible"),
    numPoliza: Joi.string().empty('').max(50).allow(null, "").default("").messages({
        'string.max': 'El número de poliza no puede tener más de 50 caracteres.'
    }),
    fechaExpedicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    fechaCaducidad: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    fechaRenovacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    fechaUltRevisado: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).empty('').allow(null, "").default(null).messages({
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
});

// Esquema para actualizar la información de un vehiculo
export const schemaVehiclesUpd = schemaVehicles.keys({
    id: Joi.string().required().messages({
        'any.required': 'Identificador no proporcionado.'
    }),
});