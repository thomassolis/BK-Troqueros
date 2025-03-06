import fs from 'fs';
import path, { dirname } from 'path';
import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';
import { BuildPathFilesServer } from './getFilePath.js';

export const DeleteFile = async (pathFile) =>{
    try {
        if (!pathFile) {
            return true;
        }

        //obtiene la ruta base
        const PATH = BuildPathFilesServer();

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