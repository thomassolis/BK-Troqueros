import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// Función para codificar un JWT
export const codificarToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token válido por 1 hora
};
