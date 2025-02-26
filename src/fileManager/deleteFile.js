import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';

// Convertimos la URL del archivo actual (import.meta.url) a una ruta de archivo
const __filename = fileURLToPath(import.meta.url);

// Usamos dirname para obtener el directorio donde se encuentra el archivo actual
const __dirname = dirname(__filename);

//obtenemos la ruta absoluta del directorio a usar
const PATH = path.resolve(__dirname, `../adjuntos`);

export const DeleteFile = async (pathFile) =>{
    try {
        if (!pathFile) {
            return true;
        }

        const folder = pathFile.split('/');

        // Construimos la ruta del archivo a eliminar
        let filePath = path.join(PATH, folder[0], folder[1]);

        //elimina los archivos
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath, { recursive: true, force: true });
        } 

        return true;
    } catch (error) {
        HandleError(v1(), error.message, 'fileManager/deleteFile/DeleteFile', error, 'user');
        throw new Error(`Error al eliminar el archivo, ${error.message}`);
    }
}