import jwt from 'jsonwebtoken';
import { decodificarToken } from '../JWT/decode.js';

const secretKey = process.env.JWT_SECRET_KEY;

// Middleware para validar el token en las cookies
const validarTokenMiddleware = (req, res, next) => {
    // Leer el token desde las cookies
    const token = req.cookies.token;

    // Si no existe el token, respondemos con un error
    if (!token) {
        console.log("Token no proporcionado");
        //return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            // Si el token es inválido o ha expirado
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }

        // Si el token es válido, decodificamos el payload y lo añadimos a la solicitud
        //req.user = decodificarToken(token);
        console.log(decodificarToken(token));

        // Llamamos al siguiente middleware o controlador
        next();
    });
};

export default validarTokenMiddleware;
