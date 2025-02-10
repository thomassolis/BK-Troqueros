import jwt from 'jsonwebtoken';
import { decodificarToken } from '../JWT/decode.js';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Middleware para validar el token en las cookies
const ValidateTokenMiddleware = (req, res, next) => {
    try {
        //Recibe el token por parte del Frontend
        const tokenFt = req.headers['authorization']?.split(' ')[1];

        // Leer el token desde las cookies
        const token = req.cookies.token;

        //Valida que el token exista
        if (!tokenFt) {
            console.log("Token no proporcionado");
            return res.json({success: false, message: 'Token no proporcionado'});
        }

        //Valida que el token no haya sido modificado
        if (tokenFt != token){
            console.log("Token modificado");
            return res.json({success: false, message: 'El token ha sido modificado'});
        }

        // Verifica el token
        jwt.verify(token, SECRET_KEY, (err) => {
            if (err) {
                // Si el token es inválido o ha expirado
                return res.json({ message: 'Token inválido o expirado' });
            }

            const dataDecode = decodificarToken(tokenFt);

            console.log(dataDecode);
            req.session.user = dataDecode;
            next();
        });
    } catch (error) {
        console.log('akjdn');
    }
};

export default ValidateTokenMiddleware;
