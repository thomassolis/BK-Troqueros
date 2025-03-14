import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//crea un esquema dinamico, donde el id del cuerpo de solicitud puede ser id_chasis, id_cabezal o id_furgon
const CreateSchema = (data) => {
    // Encuentra qué propiedad del body es un ID (asumiendo que los IDs terminan en "_id" o "id_")
    const idKey = Object.keys(data).find(key => key.includes("id"));

    // Si no hay un ID, lanza un error
    if (!idKey) {
        throw new Error("No se encontró un ID en los datos enviados.");
    }

    return Joi.object({
        [idKey]: Joi.string().trim().required(),
        status: Joi.string().allow(null, '').default(null),
        fechaExpedicion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
        fechaCaducidad: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
        fechaRenovacion: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
        fechaUltRevisado: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow(null, '').default(null),
    });
};

//valida los datos del request body
export const ValidateDataUpdateMiddleware = (req, res, next) => {
    try {
        const schema = CreateSchema(req.body); //crea el schema
        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(403).json({ success: false, message: 'Inserte bien los datos.' });
        }

        next();
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'middlewares/chassis_truckHead_truckVan/updateChassis.middleware/UpdateChassisMiddleware', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}
