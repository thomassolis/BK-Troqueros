import { VeryfyToken } from '../JWT/verifyToken.js';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';

// Middleware para validar el token en las cookies
export const ValidateTokenMiddleware = async (req, res, next) => {
    try {
        //obtiene el tiempo actual en milisegundos
        const currentTime = Math.floor(Date.now() / 1000);

        // Leer el token desde las cookies
        const token = req.cookies.token;

        //Valida que el token exista
        if (!token) {
            return res.status(401).json({success: false, message: 'Token no proporcionado'});
        }

        //Valida y decodifica la data del usuario
        const dataDecode = await VeryfyToken(token);

        //valida que el token no haya sido modificado o sea inválido
        if (!dataDecode) {
            return res.status(401).json({success: false, message: 'El token ha diso modificado o es inválido'});
        }

        //verifica el tiempo para expirar del token
        if (currentTime > dataDecode.exp) {
            return res.status(403).json({success: false, message: 'El token ha expirado'});
        }

        req.session.user = dataDecode;
        next();
    } catch (error) {
        HandleError(v1(), error.message, 'middlewares/auth.middleware/ValidateTokenMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
};
