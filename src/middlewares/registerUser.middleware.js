import Joi from 'joi';
import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';


const userSchema = Joi.object({
    nombre: Joi.string().trim().min(3).max(50).required(),
    apellido: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().email().trim().required(),
    pass: Joi.string().required(),
    rol: Joi.string().length(3).required()
});

export const ValidateUserData = (req, res, next) => {
    try {
        const { error, value } = userSchema.validate(req.body);

        if (error) {
            return res.json({ success: false, message: 'Inserte bien los datos.' });
        }

        next();
    } catch (error) {
        const code = GenerateCodeError(modules.LOGIN, typeError.usuarioNoCreado);
        HandleError(code, error.message, 'middleware/RegisterUser.middleware/ValidateUserData', error);
        return res.status(500).json({success: false, message: `Error al validar los datos del usuario ${req.body.nombre} ${req.body.apellido}`});
    }    
}

