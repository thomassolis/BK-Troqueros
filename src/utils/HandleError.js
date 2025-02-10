//import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
/*
// Función para manejar y registrar errores
export const HandleError = (message, module, error, userData) => {
    const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
    // Crear un objeto con los detalles del error
    console.log('-------------------')
    const logDetails = {
        message: message || 'Error desconocido',
        module: module || 'N/A',
        errorDetails: error ? error.stack : 'Sin detalles del error',
        user: userData || 'Usuario no autenticado',
        date: formatDateTime(new Date(Date.now())),
    };

    // Convertir el objeto de log a una cadena JSON
    const logString = JSON.stringify(logDetails, null, 2);

    // Verificar si el archivo de log existe
    if (!fs.existsSync(LOG_FILE_PATH)) {
        console.log('creado');
        // Si no existe, crearlo
        fs.writeFileSync(LOG_FILE_PATH, '', 'utf8');
    }

    fs.appendFileSync(LOG_FILE_PATH, `${logString}\n`, 'utf8');
    console.log('Mensaje agregado al archivo de log');
};*/

import fs from 'fs/promises';

export const HandleError = async (message, module, error, userData) => {
    const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
    
    const logDetails = {
        message: message || 'Error desconocido',
        module: module || 'N/A',
        errorDetails: error ? error.stack : 'Sin detalles del error',
        user: userData || 'Usuario no autenticado',
        date: formatDateTime(new Date()),
    };

    const logString = JSON.stringify(logDetails, null, 2);

    try {
        // Verificar si el archivo de log existe
        await fs.access(LOG_FILE_PATH).catch(async () => {
            console.log('Archivo de log creado');
            await fs.writeFile(LOG_FILE_PATH, '', 'utf8');
        });

        // Agregar el log al archivo
        await fs.appendFile(LOG_FILE_PATH, `${logString}\n`, 'utf8');
        console.log('Mensaje agregado al archivo de log');
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
