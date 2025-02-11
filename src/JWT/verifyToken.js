import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const VeryfyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (error, decode) => {
            if (error) {
                return reject(error);
            }
            resolve(decode);
        });
    });
};