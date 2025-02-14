import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Auth from './routes/auth.route.js';
import registerUser from './routes/CreateUser.route.js';
import client from './routes/clients.route.js';
import chassis from './routes/chassis.route.js';
import truckHead from './routes/truckHead.route.js';
import { corsOptions } from './security/configCors.js';
import { sessionConfig } from './security/configExpressSession.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(session(sessionConfig));

app.use('/api', Auth);
app.use('/api', registerUser);
app.use('/api/clients', client);
app.use('/api/chassis', chassis);
app.use('/api/truck_head', truckHead);

export default app;