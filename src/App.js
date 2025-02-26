import express from 'express';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Auth from './routes/auth.route.js';
import registerUser from './routes/CreateUser.route.js';
import client from './routes/clients.route.js';
import chassis from './routes/chassis.route.js';
import truckHead from './routes/truckHead.route.js';
import truckVan from './routes/truckVan.route.js';
import download from './routes/download.route.js';
import { corsOptions } from './security/configCors.js';
import { sessionConfig } from './security/configExpressSession.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(session(sessionConfig));

app.use('/api', Auth);
app.use('/api', registerUser);
app.use('/api/clients', client);
app.use('/api/Chasises', chassis);
app.use('/api/Cabezales', truckHead);
app.use('/api/Furgones', truckVan);
app.use('/api/download', download);

export default app;