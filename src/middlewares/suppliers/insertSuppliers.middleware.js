import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';

const userSchema = Joi.object({
    id_proveedor:  Joi.string().allow(null).optional(),
    nombre: Joi.string().trim().required(),
    personaContacto: Joi.string().allow(null, '').default(null),
    celular: Joi.string().allow(null, '').default(null),
    telefono: Joi.string().allow(null, '').default(null),
    email: Joi.string().allow(null, '').default(null),
    numeroCuenta: Joi.string().allow(null, '').default(null),
    tipoBanco: Joi.string().allow(null, '').default(null),
});

//Valida los datos enviados por el request body
export const ValidateDataSuppliersMiddleware = (req, res, next) => {
    try {
        //Valida que los datos cumplan con el esquema establecido
        const { error, value } = userSchema.validate(req.body);

        if (error) {
            return res.status(403).json({ success: false, message: 'Inserte bien los datos.' });
        }

        next();
    } catch (error) {
        HandleError(v1(), error.message, 'middlewares/suppliers/insertSuppliers.middleware/ValidateDataSuppliersMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}