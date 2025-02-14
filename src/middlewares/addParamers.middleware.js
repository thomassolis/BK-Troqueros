import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';


export const AddParamersMiddleware = (module, action) => {
    try {
        return (req, res, next) => {
            req.permission = { module, action };
            next();
        };
    } catch (error) {
        HandleError(v1(), error.message, 'middleware/addParamers.middleware/AddParamersMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}