import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';

const userSchema = Joi.object({
    id_chasis: Joi.string().trim().required(),
    status: Joi.string().trim().required(),
    fechaExpedicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
    fechaCaducidad: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
    fechaRenovacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
    fechaUltRevisado: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
});

//valida los datos del request body
export const ValidateUpdChassisDataMiddleware = (req, res, next) => {
    try {
        console.log(req.body)
        console.log(req.files)
        const { error, value } = userSchema.validate(req.body);

        if (error) {
            return res.status(403).json({ success: false, message: 'Inserte bien los datos.' });
        }

        next();
    } catch (error) {
        HandleError(v1(), error.message, 'middlewares/chassis/updateChassis.middleware/UpdateChassisMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}
