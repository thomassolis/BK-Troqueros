import dotenv from 'dotenv';

dotenv.config();

// Configuración de express-session
export const sessionConfig = {
    secret: process.env.KEY, // 🔒 Clave para firmar la sesión
    resave: false, // No guarda sesión si no hay cambios
    saveUninitialized: false, // No crea sesiones vacías
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // ⚠️ secure: true SOLO en HTTPS
};