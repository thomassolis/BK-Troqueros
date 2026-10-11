import dotenv from 'dotenv';
dotenv.config();

export const corsOptions = {
    origin: ['http://localhost:8081', 'http://192.168.9.112:8081', 'https://localhost:5173'],
    credentials: true,
};

// export const corsOptions = {
//     origin: true,
//     credentials: true,
// };