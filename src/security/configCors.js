import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
    'http://localhost:8081',
    'http://192.168.9.112:8081',
    'https://localhost:5173',
    process.env.FRONTEND_URL, // URL del frontend en producción (ej: https://tu-app.onrender.com)
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