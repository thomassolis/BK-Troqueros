import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
    'http://localhost:8081',
    'http://192.168.9.112:8081',
    'https://localhost:5173',
    'https://produccion.d3jb7p8g13dpgi.amplifyapp.com',
].filter(Boolean); // elimina valores undefined si la variable no está definida

export const corsOptions = {
    origin: (origin, callback) => {
        // Permite requests sin origin (ej: Postman, curl) y origins permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origen no permitido → ${origin}`));
        }
    },
    credentials: true,
};