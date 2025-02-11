import { VeryfyToken } from '../JWT/verifyToken.js';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';

// Middleware para validar el token en las cookies
export const ValidateTokenMiddleware = async (req, res, next) => {
    try {
        // Leer el token desde las cookies
        const token = req.cookies.token;
        console.log(token);

        //Valida que el token exista
        if (!token) {
            return res.status(401).json({success: false, message: 'Token no proporcionado'});
        }

        const dataDecode = await VeryfyToken(token);

        if (!dataDecode) {
            return res.status(401).json({success: false, message: 'El token ha diso modificado o es inválido'});
        }

        req.session.user = dataDecode;
        next();
    } catch (error) {
        HandleError(v1, error.message, 'middlewares/auth.middleware/ValidateTokenMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
};
