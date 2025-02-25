import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';

// Convertimos la URL del archivo actual (import.meta.url) a una ruta de archivo
const __filename = fileURLToPath(import.meta.url);

// Usamos dirname para obtener el directorio donde se encuentra el archivo actual
const __dirname = dirname(__filename);

//obtenemos la ruta absoluta del directorio a usar
const PATH = path.resolve(__dirname, `../adjuntos`);

//guardamos el archivo
export const SaveFile = async (folder, subFolderId, subfolder, files) =>{
    try {
        //valida que el archivo exista
        if (!files) {
            return true;
        }

        // Si `files` ya es un array, lo dejamos como está. Si es un objeto, lo convertimos en un array
        const fileArray = Array.isArray(files) ? files : [files];

        //creamos la ruta del directorio chassis
        const directoryChassis = path.join(PATH, folder)

        //comprabamos que el directorio chassis exista, sino lo creamos
        if (!fs.existsSync(directoryChassis)) {
            fs.mkdirSync(directoryChassis, { recursive: true });
        }

        //creamos la ruta del directorio id_chasis
        const directoryIdChassis = path.join(directoryChassis, subFolderId);

        //comprabamos que el directorio id_chasis exista, sino lo creamos
        if (!fs.existsSync(directoryIdChassis)) {
            fs.mkdirSync(directoryIdChassis, { recursive: true });
        }

        //creamos la ruta del directorio poliza o revisado
        const directoryPolORev = path.join(directoryIdChassis, subfolder);

        //comprabamos que el directorio id_chasis exista, sino lo creamos
        if (!fs.existsSync(directoryPolORev)) {
            fs.mkdirSync(directoryPolORev, { recursive: true });
        }
        
        //guardamos los archivos en la carpeta correspondiente
        for (const file of fileArray) {
            //creamos las rutas donde va a estar los archivos
            const pathAbsolut = path.join(directoryPolORev, file.name);

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