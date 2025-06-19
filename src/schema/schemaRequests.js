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
    id_chasis: Joi.string().required().messages({
        'any.required': 'El campo chasis es requerido.',
        'string.empty': 'El campo chasis no puede estar vacío.'
    }),
    id_cabezal: Joi.string().required().messages({
        'any.required': 'El campo cabezal es requerido.',
        'string.empty': 'El campo cabezal no puede estar vacío.'
    }),
    id_furgon: Joi.string().required().messages({
        'any.required': 'El campo furgon es requerido.',
        'string.empty': 'El campo furgon no puede estar vacío.'
    }),
    tarifa: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El campo tarifa es requerido.',
        'number.base': 'El campo tarifa debe ser un valor numérico.',
        'number.greater': 'El campo tarifa debe ser un monto mayor a cero.'
    })
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

// Esquema que incluye entrega vacio y costos extras
//const schemaOrderService_EntregaVacio_ExtraCosts = schemaOrderServiceEntregaVacio.concat(schemaExtraCostsService);

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
    tipo_entregaVacio: Joi.boolean().default(false),
    tipo_entregaProveedor: Joi.boolean().default(false),
    tipo_costosExtras: Joi.boolean().default(false),
    servicios: Joi.array().items(schemaOrderService).min(1).required().messages({
        'any.required': 'Un servicio es requerido.',
        'array.min': 'El campo tipo de servicio no puede estar vacío.'
    }),
    status: Joi.string().default('En espera')
});

// Esquema general de una petición con entrega vacía
export const schameRequestEntregaVacio = schemaRequest.keys({
    servicios: Joi.array().items(schemaOrderServiceEntregaVacio).min(1).required().messages({
        'any.required': 'Un servicio es requerido.',
        'array.min': 'El campo tipo de servicio no puede estar vacío.'
    }),
});

// Esquema general de una petición con entrega proveedor
export const schemaEntregaProveedor = schemaRequest.keys({
    id_proveedor: Joi.string().required().messages({
        'any.required': 'El campo proveedor es requerido.',
        'any.required': 'El campo proveedor no puede estar vacío.'
    }),
    precio: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El campo costo del proveedor es requerido.',
        'number.base': 'El campo costo del proveedor debe ser un valor numérico.',
        'number.greater': 'El costo del proveedor debe ser mayor que cero.'
    }),
    descripcion: Joi.string().trim().max(50).required().messages({
        'any.required': 'La descripción del costo extra es requerido.',
        'string.empty': 'La descripción del costo extra no puede estar vacío.',
        'string.max': 'La descripción no pueder ser más de 50 caracteres.'
    }),
    servicios: Joi.array().items(
        Joi.object({
            id_servicio_datos: Joi.number().required().messages({
                'any.required': 'El campo tipo de servicio es requerido.',
                'string.empty': 'El campo tipo de servicio no puede estar vacío.'
            }),
        })
    ).min(1).required().messages({
        'any.required': 'Un servicio es requerido.',
        'array.min': 'El campo tipo de servicio no puede estar vacío.'
    }),
})

// Esquema general de una petición con costos extras de los servicios
export const schemaRequestExtraCosts = schemaRequest.keys({
    servicios: Joi.array().items(schemaExtraCostsService).min(1).required().messages({
        'any.required': 'Un servicio es requerido.',
        'array.min': 'El campo tipo de servicio no puede estar vacío.'
    }),
});

// Esquema cuando la petición incluye entrega vacío y proveedor
export const schemaEntregaVacio_proveedor = schemaRequest.keys({
    pedido_servicio: Joi.array().items(
        Joi.object({
            id_servicio_datos: Joi.number().required().messages({
                'any.required': 'El campo tipo de servicio es requerido.',
                'string.empty': 'El campo tipo de servicio no puede estar vacío.'
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
    precio: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El campo costo del proveedor es requerido.',
        'number.base': 'El campo costo del proveedor debe ser un valor numérico.',
        'number.greater': 'El costo del proveedor debe ser mayor que cero.'
    }),
    descripcion: Joi.string().trim().max(50).required().messages({
        'any.required': 'La descripción del costo extra es requerido.',
        'string.empty': 'La descripción del costo extra no puede estar vacío.',
        'string.max': 'La descripción no pueder ser más de 50 caracteres.'
    }),
});

// Esquema que incluye una entrega vacía y costos extras
export const schemaEntregaVacio_ExtraCosts = schemaRequest.keys({
    servicios_datos: Joi.array().items(schemaOrderServiceEntregaVacio).min(1).required().messages({
        'any.required': 'El campo tipo de servicio es requerido.',
        'array.min': 'El campo tipo de servicio no puede estar vacío.'
    }),
    pedido_servicio: Joi.array().items(schemaExtraCostsService).min(1).required().messages({
        'any.required': 'La información del servicio es requerido.',
        'array.min': 'La información del servicio no puede estar vacío.'
    }),    
});