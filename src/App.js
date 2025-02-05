import express from 'express';
import morgan from 'morgan';
import Auth from './routes/auth.route.js';
import cookieParser from 'cookie-parser'; 

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(Auth);


export default app;