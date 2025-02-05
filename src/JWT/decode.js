import jwt from 'jsonwebtoken';

// Función para decodificar un JWT
export const decodificarToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};