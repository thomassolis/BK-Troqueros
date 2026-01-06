import dotenv from 'dotenv';
dotenv.config();

// export const corsOptions = {
//     origin: [process.env.ALLOW_IP_FT_1, process.env.ALLOW_IP_FT_2, 'http://localhost:8081', 'http://192.168.9.112:8081'],
//     credentials: true,
// };

export const corsOptions = {
    origin: true,
    credentials: true,
};