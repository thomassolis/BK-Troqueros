import { VeryfyToken } from '../JWT/verifyToken.js';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';

// Middleware para validar el token en las cookies
export const ValidateTokenMiddleware = async (req, res, next) => {
    try {
        // Leer el token desde las cookies
        const token = req.cookies.token;

        //Valida que el token exista
        if (!token) {
            return res.status(401).json({success: false, message: 'Token no proporcionado'});
        }

        //Valida y decodifica el token
        const dataDecode = await VeryfyToken(token);

        //valida que el token no sea inválido
        if (!dataDecode) {
            return res.status(401).json({success: false, message: 'Token inválido'});
        }

        req.session.user = dataDecode;
        next();
    } catch (error) {
        //pregunta si el error ha sido por TokenExpiredError
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({success: false, message: 'El token ha expirado'});
        }

        //pregunta si el error ha sido por JsonWebTokenError
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({success: false, message: 'Token modificado'});
        }

        HandleError(v1(), error.message, 'middlewares/auth.middleware/ValidateTokenMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
};
