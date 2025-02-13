import dotenv from 'dotenv';
dotenv.config();

export const corsOptions = {
    origin: process.env.ALLOW_IP_FT,
    credentials: true,
};