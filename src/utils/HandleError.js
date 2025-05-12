import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { GetSessionUserInfo } from '../contexts/sessionContext.js';

dotenv.config();

export const HandleError = async (id_log, message, module, error) => {
    try {
        const LOG_DIR = path.resolve('logs'); // Ruta absoluta a la carpeta logs
        const LOG_FILE_PATH = path.join(LOG_DIR, 'log.log');
        const user = GetSessionUserInfo(); //obtenemos la informacion del usuario

        const logDetails = `[code]: ${id_log || '-GEN-001'}\n` +
                        `[message]: ${message || 'Error desconocido'}\n` +
                        `[module]: ${module || 'N/A'}\n` +
                        `[errorDetails]: ${error ? error.stack : 'Sin detalles del error'}\n` +
                        `[user]: ${user? user.nombre : 'Usuario no autenticado'}\n` +
                        `[date]: ${formatDateTime(new Date())}\n` +
                        `-----------------------------------------------------------------\n` +
                        `-----------------------------------------------------------------\n`;

        // Verificar si la carpeta existe, si no, crearla
        await fs.mkdir(LOG_DIR, { recursive: true });

        // Verificar si el archivo de log existe, si no, crearlo vacío
        await fs.access(LOG_FILE_PATH).catch(async () => {
            await fs.writeFile(LOG_FILE_PATH, '', 'utf8');
        });

        // Agregar el log al archivo
        await fs.appendFile(LOG_FILE_PATH, `${logDetails}\n`, 'utf8');
    } catch (err) {
        console.error('Error al escribir en el archivo de log:', err);
    }
};

const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');  // Día (dd)
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Mes (MM)
    const year = date.getFullYear();  // Año (YYYY)
    const hours = String(date.getHours()).padStart(2, '0');  // Hora (HH)
    const minutes = String(date.getMinutes()).padStart(2, '0');  // Minutos (mm)
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;  // Formato dd/MM/YYYY HH:mm
};

