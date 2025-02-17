import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';

const userSchema = Joi.object({
    placa: Joi.string().trim().required(),
    numPoliza: Joi.string().required(),
    fechaExpedicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fechaCaducidad: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fechaRenovacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    fechaUltRevisado: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    foto: Joi.string().required(),
});

//Valida los datos enviados por el request body
export const ValidateDataTruckHeadMiddleware = (req, res, next) => {
    try {
        //Valida que los datos cumplan con el esquema establecido
        const { error, value } = userSchema.validate(req.body);

        if (error) {
            return res.status(403).json({ success: false, message: 'Inserte bien los datos.' });
        }

        next();
    } catch (error) {
        HandleError(v1(), error.message, 'middlewares/TruckHead/insertTruckHead.middleware/ValidateDataTruckHeadMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}