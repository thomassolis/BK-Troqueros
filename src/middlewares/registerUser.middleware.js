import Joi from 'joi';
import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';


const userSchema = Joi.object({
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

export const ValidateUserData = (req, res, next) => {
    try {
        const data = req.body; // Obtenemos la info del usuario

        // Valida que data no sea undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = userSchema.validate(data); // Valida que los datos cumplan con el schema

        if (error) {
            return res.json({ success: false, message: error.message });
        }

        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.USUARIOS, typeError.usuarioNoCreado);
        HandleError(code, error.message, 'middleware/RegisterUser.middleware/ValidateUserData', error);
        return res.status(500).json({success: false, message: `Error al validar los datos del usuario ${req.body.nombre} ${req.body.apellido}`});
    }    
}

