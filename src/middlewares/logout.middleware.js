import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';

export const CleanToken = (req, res, next) => {
    try {
        res.clearCookie('token', '', { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict' 
        });

        next();
    } catch (error) {
        HandleError(v1, error.message, 'middlewares/logout.middleware/CleanToken', error, 'user')
        return res.status(500).json({ success: false, message: "Ha ocurrido un error inesperado al cerrar sesión" });
    }
};