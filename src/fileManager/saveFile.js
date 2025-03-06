import fs from 'fs';
import path, { dirname } from 'path';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';
import { BuildPathFilesServer } from './getFilePath.js';

//guardamos el archivo
export const SaveFile = async (folders, files) =>{
    try {
        //valida que el archivo exista
        if (!files) {
            return true;
        }

        //obtiene ka ruta base
        const PATH = BuildPathFilesServer();

        // Si `files` ya es un array, lo dejamos como está. Si es un objeto, lo convertimos en un array
        const fileArray = Array.isArray(files) ? files : [files];

        //creamos la ruta del directorio chassis
        const directoryChassis = path.join(PATH, folders)

        //comprabamos que el directorio chassis exista, sino lo creamos
        if (!fs.existsSync(directoryChassis)) {
            fs.mkdirSync(directoryChassis, { recursive: true });
        }
        
        //guardamos los archivos en la carpeta correspondiente
        for (const file of fileArray) {
            //creamos las rutas donde va a estar los archivos
            const pathAbsolut = path.join(directoryChassis, file.name);

            await new Promise((resolve, reject) => {
                file.mv(pathAbsolut, (err) => {
                    if (err) {
                        reject(`Error al guardar el archivo ${file.name}: ${err}`);
                    } else {
                        resolve();
                    }
                });
            });
        }

        return true;  // retorna true, sí todos los archivos se guardaron correctamente
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/insertChassisController/SaveFile', error, 'user');
        throw new Error(`No se pudo guardar el archivo, ${error.message}`);
    }
}