import fs from 'fs';
import path from 'path';
import { HandleError } from '../utils/HandleError.js';
import { SaveFile } from './saveFile.js';
import { BuildPathFilesServer } from './getFilePath.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { typeError } from '../dictionary/typeError.js';

//Actualiza los archivos del sistema
export const UpdateFile = async (folder, files) => {
    try {
        //valida que folder exista
        if (!folder) {
            return {success: true, msg: ''};
        }

        //obtenemos la ruta donde estan alojadas los archivos del sistema
        const PATH = BuildPathFilesServer();

        // Construimos la ruta del archivo a actualizar
        const filePath = path.join(PATH, folder);

        //obtenemos los archivos del servidor
        let filesServer = GetFileServer(filePath);

        // Si `files` es null o un array vacío, eliminamos todos los archivos de la carpeta
        if (!files && fs.existsSync(filePath)) {
            fs.readdirSync(filePath).forEach(file => {
                //construimos la ruta del archivo a eliminar
                file = path.join(filePath, file);
                fs.unlinkSync(file); // Elimina cada archivo dentro de la carpeta
            });

            return {success: true, msg: 'Archivo actualizado'};
        }

        //recorrer el array y verificar si cada elemento es un archivo
        for (const item of files) {
            await ComparateFileWithFilesServer(item, folder, filesServer);
        }

        // Eliminar los archivos restantes en `filesServer`
        filesServer.forEach(file => fs.unlinkSync(path.join(filePath, file)));

        //eliminamos los archivos temporales
        DeleteFileTemp(`${PATH}/archivos_temporales`);

        return {success: true, msg: 'Archivo actualizado'};
    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, error.msg, 'fileManager/updateFile/UpdateFile', error);
        throw { success: false, msg: error.msg };
    }
}

//valida si es un archivo
const isFile = (item) => {
    const obj = Object.values(item)[0]; // Extrae el objeto dentro del array

    if (obj && obj.name && obj.data && obj.size && obj.encoding && obj.mimetype && obj.md5 && obj.mv) {
        return true
    }

    return false;
};

//obtiene los archivos del servidor de una carpeta especifica
const GetFileServer = (directoryPath) => {
    try {
        // Leer los contenidos de la carpeta
        const files = fs.readdirSync(directoryPath);

        // Filtrar solo archivos, no directorios
        const filePaths = files.filter(file => fs.statSync(path.join(directoryPath, file)).isFile());

        // Retornar los archivos encontrados
        return filePaths;
    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, `Error al obtener los archivos del servidor, ${error.msg}`, 'fileManager/updateFile/GetFileServer', error);
        throw { success: false, msg: `No se pudo actualizar el archivo` };
    }
}

//compara el nuevo archivo con los archivos del servidor
const ComparateFileWithFilesServer = async (file, folder, filesServer) => {
    let tempFilePath = null;
    let originalPath =  null;

    try {
        //obtenemos los valores del archivo
        const archivo = Object.values(file);        

        // Verifica si el elemento es un archivo
        if (isFile(file)) {
            //comprueba si el archivo ya existe en el servidor
            const index = filesServer.indexOf(archivo[0]['name']);

            //si el archivo existe lo eliminamos de la lista
            if (index !== -1) {
                // Si existe, eliminamos el archivo de la lista
                const removedFile = filesServer.splice(index, 1)[0];

                //guardamos la ruta del archivo removido
                originalPath = `${folder}/${removedFile}`;

                //guardamos el archivo temporalmente y retornamos su ruta
                tempFilePath = TemporarilyStoresFile(removedFile, folder);

                //guardamos el archivo
                await SaveFile(folder, archivo);
            }
            
            //sino existe, guardamos el archivo
            await SaveFile(folder, archivo);
        }

        //comprueba si el archivo ya existe en el servidor
        const index = filesServer.indexOf(archivo[0]['name']);

        //si el archivo existe lo elimnamos de la lista
        if (index !== -1) {
            // Si existe, eliminamos el archivo de la lista
            filesServer.splice(index, 1)[0];
        }
    } catch (error) {
        filesServer = [];
        //si hubo error, restauramos el archivo
        if (tempFilePath && originalPath) {
            RestoreFileFromTemp(tempFilePath, originalPath);

            //eliminamos el archivo de la carpeta archivos_temporales
            DeleteFileTemp(path.dirname(tempFilePath));
        }

        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, `Error al comparar los archivos, ${error.msg}`, 'fileManager/updateFile/ComparateFileWithFilesServer', error);
        throw { success: false, msg: `No se pudo actualizar el archivo` };
    }
}

//almacena temporalmente el archivo a eliminar
const TemporarilyStoresFile = (fileName, folder) => {
    try {
        //obtiene la ruta base de los archivos guardados en el servidor
        const PATH = BuildPathFilesServer();

        //ruta completa del archivo original
        const originalFilePath = path.join(PATH, folder, fileName); 

        //verifica que el archivo exista
        if (!fs.existsSync(originalFilePath)) {
            throw { success: false, msg: `UPS, ha ocurrido un problema, inténtalo más tarde` };
        }

        //construye la ruta de los donde se guardarán los archivos temporales
        const pathTemporarilyStoresFile = path.join(PATH, 'archivos_temporales');

        //comprabamos que el directorio exista, sino lo creamos
        if (!fs.existsSync(pathTemporarilyStoresFile)) {
            fs.mkdirSync(pathTemporarilyStoresFile, { recursive: true });
        }

        //construimos la ruta del archivo temporal
        const tempFilePath = path.join(pathTemporarilyStoresFile, fileName);

        //valida que el directorio exista, sino lo creamos
        if (fs.existsSync(tempFilePath)) {
            // Copiar el archivo a la carpeta temporal
            fs.copyFileSync(originalFilePath, tempFilePath);

            return tempFilePath; //retornamos la ruta del archivo temporal
        }

        return {success: false, msg: 'No se pudo guardar el archivo temporalmente'};
    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, `Error al guardar temporalmente el archivo, ${error.msg}`, 'fileManager/updateFile/TemporarilyStoresFile', error);
        throw { success: false, msg: `UPS, ha ocurrido un problema, inténtalo más tarde` };
    }
}

// Función para restaurar un archivo desde su ubicación temporal
const RestoreFileFromTemp = (tempFilePath, filePath) => {
    try {
        //obtiene la ruta base de los archivos guardados en el servidor
        const PATH = BuildPathFilesServer();

        //construye la ruta del archivo original
        const originalFilePath = path.join(PATH, filePath);

        //copiar de vuelta al directorio original
        if (fs.existsSync(tempFilePath)) {
            fs.copyFileSync(tempFilePath, originalFilePath);
        }
    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, `No se pudo restaurar el archivo, ${error.msg}`, 'fileManager/updateFile/RestoreFileFromTemp', error);
        throw { success: false, msg: `UPS, ha ocurrido un problema, inténtalo más tarde` };
    }
}

const DeleteFileTemp = (pathTemp) => {
    try {
        //comprabamos que el directorio existe, sino lo creamos
        if (!fs.existsSync(pathTemp)) {
            fs.mkdirSync(pathTemp, { recursive: true });
        }                

        //obtiene los archivos temporales
        const files = GetFileServer(pathTemp);

        //eliminamos los archivos temporales
        files.forEach(file => fs.unlinkSync(path.join(pathTemp, file)));
    } catch (error) {
        const code = GenerateCodeError('-', typeError.general);
        HandleError(code, `No se pudo eliminar los archivos temporales, ${error.msg}`, 'fileManager/updateFile/DeleteFileTemp', error);
        throw { success: false, msg: `UPS, ha ocurrido un problema, inténtalo más tarde` };
    }
}