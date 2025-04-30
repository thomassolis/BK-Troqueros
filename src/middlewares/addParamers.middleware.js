import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';


export const AddParamersMiddleware = (module, action) => {
    try {
        return (req, res, next) => {
            req.permission = { module, action };
            req.module = 
            next();
        };
    } catch (error) {
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError.parametrosNoAgregados);
        HandleError(code, error.message, 'middleware/addParamers.middleware/AddParamersMiddleware', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor--'});
    }
}