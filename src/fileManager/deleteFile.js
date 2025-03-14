import fs from 'fs';
import path, { dirname } from 'path';
import { HandleError } from '../utils/HandleError.js';
import { BuildPathFilesServer } from './getFilePath.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { typeError } from '../dictionary/typeError.js';

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
        const code = GenerateCodeError('-', typeError.chasisNoEncontrado);
        HandleError(code, error.message, 'fileManager/deleteFile/DeleteFile', error);
        throw new Error(`Error al eliminar el archivo`);
    }
}