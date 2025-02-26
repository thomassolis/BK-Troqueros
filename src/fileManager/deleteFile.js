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

export const DeleteFile = async (folder, subfolderId, subfolder, files) =>{
    try {
        // Construimos la ruta del archivo a eliminar
        let filePath = path.join(PATH, folder, subfolderId, subfolder);

        // Si `files` es null o un array vacío, eliminamos todos los archivos de la carpeta
        if (!files && fs.existsSync(filePath)) {
            fs.readdirSync(filePath).forEach(file => {
                filePath = path.join(filePath, file);
                fs.unlinkSync(filePath); // Elimina cada archivo dentro de la carpeta
            });
        }

        // Si `files` tiene datos, eliminamos solo esos archivos
        /*files.forEach(file => {
            filePath = path.join(filePath, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Archivo eliminado: ${filePath}`);
            } else {
                console.log(`Archivo no encontrado: ${filePath}`);
            }
        });*/

        return true;
    } catch (error) {
        HandleError(v1(), error.message, 'fileManager/deleteFile/DeleteFile', error, 'user');
        throw new Error(`Error al eliminar el archivo, ${error.message}`);
    }
}