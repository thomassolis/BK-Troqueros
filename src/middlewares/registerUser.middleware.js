import Joi from 'joi';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';


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
        HandleError(v1(), error.message, 'RegisterUser.middleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }    
}

