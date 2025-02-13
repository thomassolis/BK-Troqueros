import dotenv from 'dotenv';
dotenv.config();

export const corsOptions = {
    origin: [process.env.ALLOW_IP_FT_1, process.env.ALLOW_IP_FT_2],
    credentials: true,
};