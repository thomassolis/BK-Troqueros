import Joi from "joi";
import { HandleError } from "../utils/HandleError.js";


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
        console.log(error)
        HandleError(error.message, 'RegisterUser.middleware', error, 'user');
    }    
}

export const CleanData = (req, res, next) => {
    try {
        const allowedFields = ['nombre', 'apellido', 'email'];
        const cleanedData = {};

        for (const key of allowedFields) {
            if (req.body.hasOwnProperty(key)) {
                cleanedData[key] = req.body[key];
            }
        }

        // Sanitizar los valores de tipo string
        for (const key in cleanedData) {
            if (typeof cleanedData[key] === 'string') {
                cleanedData[key] = cleanedData[key]
                    .trim() // Eliminar espacios al inicio y final
                    .replace(/</g, "&lt;") // Evitar etiquetas HTML < >
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;") // Evitar comillas dobles
                    .replace(/'/g, "&#39;"); // Evitar comillas simples
            }
        }

        if (req.body.hasOwnProperty('pass')) {
            cleanedData.pass = req.body.pass;
        }

        req.body = cleanedData;
        next();
    } catch (error) {
        console.log(error)
        HandleError(error.message, 'middleware/CleanData', error, 'user');
    }
};

