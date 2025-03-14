import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';


export const AddParamersMiddleware = (module, action) => {
    try {
        return (req, res, next) => {
            req.permission = { module, action };
            next();
        };
    } catch (error) {
        const code = GenerateCodeError(modules.CHASIS, typeError.parametrosNoAgregados);
        HandleError(code, error.message, 'middleware/addParamers.middleware/AddParamersMiddleware', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}