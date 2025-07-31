import Joi from 'joi';

// Valida que las fechas no sean menores a la fecha actual
const ValidateNotPastDate = (value, helpers) => {
    const selectedDate = new Date(value);
        const currentDate = new Date();

        // Limpiar la hora para comparar solo la fecha
        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        console.log('selectedDate: ',selectedDate)
        console.log('currentDate: ',currentDate)
        if (selectedDate < currentDate) {
            return helpers.error('date.minToday');
        }

        return value;
}

// Esquema para los servicios de las peticiones
const schemaOrderService = Joi.object({
    id_servicio_datos: Joi.number().required().messages({
        'any.required': 'El campo tipo de servicio es requerido.',
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
}).unknown(false).messages({
    'object.unknown': 'El campo {#key} no está permitido.'
});

// Esquema cuando el servicio incluye una entrega vacía
const schemaOrderServiceEntregaVacio = schemaOrderService.keys({
    entrega_vacio: Joi.boolean().required().messages({
        'any.required': 'El campo entrega vacío es requerido.'
    }),
    fecha_limite: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().custom(ValidateNotPastDate).messages({
        'any.required': 'El campo fecha limite es requerido.',
        'string.empty': 'El campo fecha limite no puede estar vacío.',
        'string.pattern.base': 'La fecha limite debe tener el formato año-mes-dia.',
        'date.minToday': 'La fecha limite no puede ser menor a la fecha actual.'
    }),
});

// Esquema cuando el servicio incluye costos extras
const schemaExtraCostsServices = Joi.object({
    precio: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El precio del costo extra es requerido.',
        'number.base': 'El precio del costo extra debe ser un valor numérico.',
        'number.greater': 'El precio del costo extra debe ser mayor a cero.'
    }),
    descripcion: Joi.string().trim().max(50).required().messages({
        'any.required': 'La descripción del costo extra es requerido.',
        'string.empty': 'La descripción del costo extra no puede estar vacío.',
        'string.max': 'La descripción no pueder ser más de 50 caracteres.'
    }),
});

// Esquema que incluye costos extras por servicio
const schemaExtraCostsService = schemaOrderService.keys({
    costos_extras: Joi.array().items(schemaExtraCostsServices)
});

// Esquema de servicio para proveedor
const schemaServiceSupplier = Joi.object({
    id_servicio_datos: Joi.number().required().messages({
        'any.required': 'El campo tipo de servicio es requerido.',
        'string.empty': 'El campo tipo de servicio no puede estar vacío.'
    }),
    tarifa: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El campo tarifa es requerido.',
        'number.base': 'El campo tarifa debe ser un valor numérico.',
        'number.greater': 'El campo tarifa debe ser un monto mayor a cero.'
    }),
}).unknown(false).messages({
    'object.unknown': 'El campo {#key} no está permitido.'
});

// Esquema de servicio proveedor con entrega vacío
const schemaServiceSupplierEntregaVacio = schemaServiceSupplier.keys({
    entrega_vacio: Joi.boolean().required().messages({
        'any.required': 'El campo entrega vacío es requerido.'
    }),
    fecha_limite: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().custom(ValidateNotPastDate).messages({
        'any.required': 'El campo fecha limite es requerido.',
        'string.empty': 'El campo fecha limite no puede estar vacío.',
        'string.pattern.base': 'La fecha limite debe tener el formato año-mes-dia.',
        'date.minToday': 'La fecha limite no puede ser menor a la fecha actual.'
    }),
})


// Función que valida las posibles entradas de los datos de los servicios
const ValidateSchema = Joi.custom((value, helpers) => {
    const hasEntregaVacio = 'entrega_vacio' in value && value.entrega_vacio === true; // Comprueba si el servicio tiene entrega vacío
    // Comprueba si el servicio tiene costos extras
    const hasExtraCosts = Array.isArray(value.costos_extras) && value.costos_extras.length > 0;

    let schema;

    // Comprueba el tipo de esquema dependiendo del servicio
    if (hasEntregaVacio && hasExtraCosts) { // Valida si el servicio incluye entrega vacío y costos extras
        schema = schemaOrderServiceEntregaVacio.concat(schemaExtraCostsService);
    } else if (hasEntregaVacio) { // Valida si el servicio incluye entrega vacio
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


// Función que valida las posibles entradas de los datos de los servicios
const ValidateSchemaSupplier = Joi.custom((value, helpers) => {
    const hasEntregaVacio = 'entrega_vacio' in value && value.entrega_vacio === true; // Comprueba si el servicio tiene entrega vacío

    let schema;

    // Comprueba el tipo de esquema dependiendo del servicio
    if (hasEntregaVacio) { // Valida si el servicio incluye entrega vacío y costos extras
        schema = schemaServiceSupplierEntregaVacio;
    } else {
        schema = schemaServiceSupplier;
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
    fecha_salida: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().custom(ValidateNotPastDate).messages({
        'any.required': 'El campo fecha de salida es requerido.',
        'string.pattern.base': 'La fecha debe tener el formato año-mes-dia.',
        'date.minToday': 'La fecha de salida no puede ser menor a la fecha actual.'
    }),
    hora_salida: Joi.string().custom((value, helpers) => {
        const [hora, minuto, segundo] = value.split(':').map(Number);

        if (hora < 0 || hora > 23) {
            return helpers.message('La hora debe ser un valor entre 00 y 23.');
        }
        if (minuto < 0 || minuto > 59) {
            return helpers.message('Los minutos deben ser un valor entre 00 y 59.');
        }
        if (segundo < 0 || segundo > 59) {
            return helpers.message('Los segundos deben ser un valor entre 00 y 59.');
        }

        return value;
    }).pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).optional().messages({
        'any.required': 'El campo hora de salida es requerido.',
        'string.pattern.base': 'La hora de salida debe tener el formato HH:mm:ss.',
        'string.empty': 'La hora de salida no puede estar vacía.'
    }),
    servicios: Joi.array().items(ValidateSchema).min(1).required().messages({
        'any.required': 'Debe incluir al menos un servicio.',
        'array.min': 'Debe incluir al menos un servicio.',
        'any.custom': '{{#message}}'
    }),
    status: Joi.string().default('En espera')
}).unknown(false).messages({
    'object.unknown': 'El campo {#key} no está permitido.'
});

// Esquema general de una petición con entrega proveedor
export const schemaEntregaProveedor = schemaRequest.keys({
    id_proveedor: Joi.string().required().messages({
        'any.required': 'El campo proveedor es requerido.',
        'any.required': 'El campo proveedor no puede estar vacío.'
    }),
    precio_proveedor: Joi.number().precision(2).required().greater(0).messages({
        'any.required': 'El precio del proveedor es requerido.',
        'number.base': 'El precio del proveedor debe ser un valor numérico.',
        'number.greater': 'El precio del proveedor debe ser mayor a cero.'
    }),
    servicios: Joi.array().items(ValidateSchemaSupplier).max(1).required().messages({
        'any.required': 'Debe incluir al menos un servicio.',
        'array.max': 'Solo se permite un servicio por proveedor.',
        'any.custom': '{{#message}}'
    }),
}).unknown(false).messages({
    'object.unknown': 'El campo {#key} no está permitido.'
});


/******************************************************************
*                                                                 *
*             ESQUEMA PARA ACTUALIZAR UNA PETICIÓN                *
*                                                                 *
******************************************************************/

// Esquema para actualizar un servicio normal (no incluye costos extras, entrega vacio)
const schemaUpdOrderService = schemaOrderService.keys({
    id_pedidoServicio: Joi.number().required().messages({
        'any.required': 'El identificador del servicio es requerido'
    })
})

// Esquema de servicios con costos extras
const schemaUpdExtraCostsServices = schemaExtraCostsServices.keys({
    id_costos_extras: Joi.number().required().messages({
        'any.required': 'El identificador del costo extra es requerido'
    })
})

// Esquema que de servicios con costos extras (la diferencia es que encapsula los costos extras dentro de un array)
const schemaUpdExtraCostsService = Joi.object({
    costos_extras: Joi.array().items(schemaUpdExtraCostsServices),
    nuevos_costos_extras: Joi.array().items(schemaExtraCostsServices),
});

// Esquema de un servicio con proveedor
const schemaUpdServiceSupplier = schemaServiceSupplier.keys({
    id_pedidoServicio: Joi.number().required().messages({
        'any.required': 'El identificador del servicio es requerido'
    })
});

// Función que valida las posibles entradas de los datos de los servicios a actualizar
const ValidateSchemaUpdServices = Joi.custom((value, helpers) => {
    const hasEntregaVacio = 'entrega_vacio' in value && value.entrega_vacio === true; // Comprueba si el servicio tiene entrega vacío
    // Comprueba si el servicio tiene costos extras
    const hasExtraCosts =
        (Array.isArray(value.costos_extras) && value.costos_extras.length > 0) ||
        (Array.isArray(value.nuevos_costos_extras) && value.nuevos_costos_extras.length > 0);


    let schema;

    // Comprueba el tipo de esquema dependiendo del servicio
    if (hasEntregaVacio && hasExtraCosts) { // Valida si el servicio incluye entrega vacío y costos extras
        schema = schemaOrderServiceEntregaVacio.concat(schemaUpdExtraCostsService).concat(schemaUpdOrderService);
    } else if (hasEntregaVacio) { // Valida si el servicio incluye entrega vacio
        schema = schemaOrderServiceEntregaVacio.concat(schemaUpdOrderService);
    } else if (hasExtraCosts) { // Valaida si el servicio incluye costos extras
        schema = schemaUpdOrderService.concat(schemaUpdExtraCostsService);
    } else { // Valida si el servicio no incluye entrega vacio o costos extras
        schema = schemaUpdOrderService;
    }

    const result = schema.validate(value, { abortEarly: false });

    // En caso de error retornar el mensaje
    if (result.error) {
        return helpers.error('any.custom', { message: result.error.details[0].message });
    }

    return result.value;
});


// Valida el esquema cuando la petición es con proveedor
const ValidateSchemaUpdSupplier = Joi.custom((value, helpers) => {
    const hasEntregaVacio = 'entrega_vacio' in value && value.entrega_vacio === true; // Comprueba si el servicio tiene entrega vacío

    let schema;

    // Comprueba el tipo de esquema dependiendo del servicio
    if (hasEntregaVacio) { // Valida si el servicio incluye entrega vacío
        schema = schemaUpdServiceSupplier.concat(schemaServiceSupplierEntregaVacio);
    } else {
        schema = schemaUpdServiceSupplier;
    }

    const result = schema.validate(value, { abortEarly: false });

    // En caso de error retornar el mensaje
    if (result.error) {
        return helpers.error('any.custom', { message: result.error.details[0].message });
    }

    return result.value;
});

// Esquema general para actualizar una petición
export const schemaUpdRequest = schemaRequest
.fork(['status'], (schema) => schema.forbidden())
.keys({
    id_peticion: Joi.string().required().messages({
        'any.required': 'El identificados de la petición es requerido',
        'string.empty': 'El identificador de la petición es requerido'
    }),
    servicios: Joi.array().items(ValidateSchemaUpdServices).min(1).required().messages({
        'any.required': 'Debe incluir al menos un servicio.',
        'array.min': 'Debe incluir al menos un servicio.',
        'any.custom': '{{#message}}'
    }),
    nuevos_servicios: Joi.array().items(ValidateSchema).optional().messages({
        'any.custom': '{{#message}}'
    }),
});

// Esquema general de una petición con entrega proveedor
export const schemaUpdEntregaProveedor = schemaEntregaProveedor.keys({
    id_peticion: Joi.string().required().messages({
        'any.required': 'El identificados de la petición es requerido',
        'string.empty': 'El identificador de la petición es requerido'
    }),
    servicios: Joi.array().items(ValidateSchemaUpdSupplier).min(1).max(1).optional().messages({
        'array.min': 'Debe incluir al menos un servicio.',
        'array.max': 'Solo se permite un servicio por proveedor.',
        'any.custom': '{{#message}}'
    }),
    nuevos_servicios: Joi.array().items(ValidateSchemaSupplier).min(1).max(1).optional().messages({
        'array.min': 'Debe incluir al menos un servicio.',
        'array.max': 'Solo se permite un servicio por proveedor.',
        'any.custom': '{{#message}}'
    }),
}).xor('servicios', 'nuevos_servicios')
.error(errors => {
    for (const err of errors) {
        if (err.code === 'object.xor') {
            err.message = 'Solo se permite un servicio por proveedor';
        } else if (err.code === 'object.missing') {
            err.message = 'Debe incluir al menos un servicio';
        }
    }
    return errors;
})

