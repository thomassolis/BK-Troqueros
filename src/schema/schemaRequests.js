import Joi from 'joi';

// Esquema para los servicios de las peticiones
const schemaOrderService = Joi.object({
    id_servicio_datos: Joi.number().required().messages({
        'any.required': 'El campo tipo de servicio es requerido. jajaja',
        'string.empty': 'El campo tipo de servicio no puede estar vacío.'
    }),
    id_conductor: Joi.string().required().messages({
        'any.required': 'El campo conductor es requerido.',
        'string.empty': 'El campo conductor no puede estar vacío.'
    }),
    id_cabezal: Joi.string().required().messages({
        'any.required': 'El campo cabezal es requerido.',
        'string.empty': 'El campo cabezal no puede estar vacío.'
    }),    
    id_chasis: Joi.string().messages({
        'string.empty': 'El campo chasis no puede estar vacío.'
    }),
    id_furgon: Joi.string().messages({
        'string.empty': 'El campo furgon no puede estar vacío.'
    }),
    tarifa: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El campo tarifa es requerido.',
        'number.base': 'El campo tarifa debe ser un valor numérico.',
        'number.greater': 'El campo tarifa debe ser un monto mayor a cero.'
    }),
    entrega_vacio: Joi.boolean().optional().default(false),
    status: Joi.string().default('No Disponible'),
}).xor('id_chasis', 'id_furgon')
.error(errors => {
    for (const err of errors) {
        if (err.code === 'object.xor') {
            err.message = 'Solo puede elegir chasis o furgon, no ambos.';
        } else if (err.code === 'object.missing') {
            err.message = 'Debe especificar sí es chasis o furgon.';
        }
    }
    return errors;
});

// Esquema cuando el servicio incluye una entrega vacía
const schemaOrderServiceEntregaVacio = schemaOrderService.keys({
    entrega_vacio: Joi.boolean().required().messages({
        'any.required': 'El campo entrega vacío es requerido.'
    }),
    fecha_limite: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
        'any.required': 'El campo fecha limite es requerido.',
        'string.pattern.base': 'La fecha limite debe tener el formato año-mes-dia.'
    }),
});

// Esquema que incluye costos extras por servicio
const schemaExtraCostsService = schemaOrderService.keys({
    precio: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El precio del costo extra es requerido.',
        'number.base': 'El precio del costo extra debe ser un valor numérico.',
        'number.greater': 'El precio del costo extra debe ser mayor que cero.'
    }),
    descripcion: Joi.string().trim().max(50).required().messages({
        'any.required': 'La descripción del costo extra es requerido.',
        'string.empty': 'La descripción del costo extra no puede estar vacío.',
        'string.max': 'La descripción no pueder ser más de 50 caracteres.'
    }),
});


// Función que valida las posibles entradas de los datos de los servicios
const ValidateSchema = Joi.custom((value, helpers) => {
    const hasEntregaVacion = 'entrega_vacio' in value && value.entrega_vacio === true; // Comprueba si el servicio tiene entrega vacío
    const hasExtraCosts = 'precio' in value || 'descripcion' in value; // Comprueba si el servicio tiene costos extras

    let schema;

    // Comprueba el tipo de esquema dependiendo del servicio
    if (hasEntregaVacion && hasExtraCosts) { // Valida si el servicio incluye entrega vacío y costos extras
        schema = schemaOrderServiceEntregaVacio.concat(schemaExtraCostsService);
    } else if (hasEntregaVacion) { // Valida si el servicio incluye entrega vacio
        schema = schemaOrderServiceEntregaVacio;
    } else if (hasExtraCosts) { // Valaida si el servicio incluye costos extras
        schema = schemaExtraCostsService;
    } else { // Valida si el servicio no incluye entrega vacio o costos extras
        schema = schemaOrderService;
    }

    const result = schema.validate(value, { abortEarly: false });

    // En caso de error retornar el mensaje
    if (result.error) {
        return helpers.error('any.custom', { message: result.error.details[0].message });
    }

    return result.value;
});

// Esquema general de una petición (no incluye un costo extra, no incluye un proveedor, no incluye una entrega vacío)
export const schemaRequest = Joi.object({
    id_cliente: Joi.string().trim().required().messages({
        'any.required': 'El campo cliente es requerido.',
        'string.empty': 'El campo cliente no puede estar vacío.'
    }),
    fecha_salida: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
        'any.required': 'El campo fecha de salida es requerido.',
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.'
    }),
    servicios: Joi.array().items(ValidateSchema).min(1).required().messages({
        'any.required': 'Debe incluir al menos un servicio.',
        'array.min': 'Debe incluir al menos un servicio.',
        'any.custom': '{{#message}}'
    }),
    status: Joi.string().default('En espera')
});

// Esquema general de una petición con entrega proveedor
export const schemaEntregaProveedor = schemaRequest.keys({
    id_proveedor: Joi.string().required().messages({
        'any.required': 'El campo proveedor es requerido.',
        'any.required': 'El campo proveedor no puede estar vacío.'
    }),
    servicios: Joi.array().items(
        Joi.object({
            id_servicio_datos: Joi.number().required().messages({
                'any.required': 'El campo tipo de servicio es requerido.',
                'string.empty': 'El campo tipo de servicio no puede estar vacío.'
            }),
            tarifa: Joi.number().precision(2).required().greater(0).messages({
                'any.required': 'El campo tarifa es requerido.',
                'number.base': 'El campo tarifa debe ser un valor numérico.',
                'number.greater': 'El campo tarifa debe ser un monto mayor a cero.'
            }),
        })
    ).min(1).required().messages({
        'any.required': 'Un servicio es requerido.',
        'array.min': 'El campo tipo de servicio no puede estar vacío.'
    }),
})

// Esquema cuando la petición incluye entrega vacío y proveedor
export const schemaEntregaVacio_proveedor = schemaRequest.keys({
    servicios: Joi.array().items(
        Joi.object({
            id_servicio_datos: Joi.number().required().messages({
                'any.required': 'El campo tipo de servicio es requerido.',
                'string.empty': 'El campo tipo de servicio no puede estar vacío.'
            }),
            tarifa: Joi.number().precision(2).required().greater(0).messages({
                'any.required': 'El campo tarifa es requerido.',
                'number.base': 'El campo tarifa debe ser un valor numérico.',
                'number.greater': 'El campo tarifa debe ser un monto mayor a cero.'
            }),
            entrega_vacio: Joi.boolean().required().messages({
                'any.required': 'El campo entrega vacío es requerido.'
            }),
            fecha_limite: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
                'any.required': 'El campo fecha limite es requerido.',
                'string.pattern.base': 'La fecha limite debe tener el formato año-mes-dia.'
            }),
        })
    ).min(1).required().messages({
        'any.required': 'La información del servicio es requerido.',
        'array.min': 'La información del servicio no puede estar vacío.'
    }),
    id_proveedor: Joi.string().required().messages({
        'any.required': 'El campo proveedor es requerido.',
        'any.required': 'El campo proveedor no puede estar vacío.'
    }),
});
