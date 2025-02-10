import sql from 'mssql';
import dotenv from 'dotenv';
import { HandleError } from '../utils/HandleError.js';

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
        
        console.error('Error al conectar a la base de datos:', error.message);
        HandleError(error.message, 'ConnectDB', error, 'user')
        throw new Error('No se pudo conectar a la base de datos');
    }
};

const CloseDB = async () => {
    try {
        await pool.close();
    } catch (error) {
        console.error('Error al cerrar la conexión a la base de datos:', error.message);
        HandleError(error.message, 'CloseDB', error, 'user')
    }
};

export { ConnectDB, CloseDB, pool };