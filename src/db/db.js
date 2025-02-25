import sql from 'mssql';
import dotenv from 'dotenv';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';

dotenv.config();

const dbsetting_Mlc = {
    user: process.env.USER,
    password: process.env.PASS,
    server: process.env.SERVER,
    database: process.env.DB,
    options: {
        encrypt: false,
      },
};

const pool = new sql.ConnectionPool(dbsetting_Mlc);
const poolConnect = pool.connect();

const ConnectDB = async () => {
    try {
        await poolConnect;
    } catch (error) {
        HandleError(v1(), error.message, 'db/ConnectDB', error, 'user')
        throw new Error('No se pudo conectar a la base de datos');
    }
};

const CloseDB = async () => {
    try {
        await pool.close();
    } catch (error) {
        HandleError(v1(), error.message, 'db/CloseDB', error, 'user')
    }
};

export { ConnectDB, CloseDB, pool };