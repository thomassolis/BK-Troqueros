import sql from 'mssql';
import dotenv from 'dotenv';
import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

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
        const code = GenerateCodeError(modules.DATABASE, typeError.coneccionDB);
        HandleError(code, error.message, 'db/ConnectDB', error);
        throw new Error('No se pudo conectar a la base de datos');
    }
};

const CloseDB = async () => {
    try {
        await pool.close();
    } catch (error) {
        const code = GenerateCodeError(modules.DATABASE, typeError.coneccionDB);
        HandleError(code, error.message, 'db/CloseDB', error);
        throw new Error('Error al cerrar la conexion con la base de datos');
    }
};

export { ConnectDB, CloseDB, pool };