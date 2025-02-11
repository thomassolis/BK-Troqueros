import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Auth from './routes/auth.route.js';
import registerUser from './routes/CreateUser.route.js';

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.ALLOW_IP_FT,
    credentials: true,
};

// Configuración de express-session
const sessionConfig = {
    secret: process.env.KEY, // 🔒 Clave para firmar la sesión
    resave: false, // No guarda sesión si no hay cambios
    saveUninitialized: false, // No crea sesiones vacías
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // ⚠️ secure: true SOLO en HTTPS
};

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(session(sessionConfig));

app.use('/api', Auth);
app.use('/api', registerUser);

export default app;