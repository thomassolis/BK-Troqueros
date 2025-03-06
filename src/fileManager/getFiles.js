import fs from 'fs';
import path from 'path';
import { v1 } from 'uuid';
import { HandleError } from '../utils/HandleError.js';
import { BuildPathFilesServer } from './getFilePath.js';

export const GetLinksDownloadFiles = (linkDownload, linkComplementary) => {
    try {
        //valida que la ruta fisica exista
        if (!linkComplementary) {
            return null;
        }

        //obtiene la ruta base
        const BASE_PATHS = BuildPathFilesServer();

        //construimos la ruta completa
        const directory = path.join(BASE_PATHS, linkComplementary);

        //Validar que el directorio exista
        if (!fs.existsSync(directory)) {
            return null;
        }

        //Leer todos los archivos en la carpeta
        const files = fs.readdirSync(directory);

        //Validar si hay archivos en la carpeta
        if (files.length === 0) {
            return null;
        }

        //Generar los enlaces de descarga
        const downloadLinks = files.map((file, index) => ({
            [`link${index + 1}`]: {
                name: file, // Nombre del archivo
                url: `${linkDownload}/${linkComplementary}/${file}` // URL de descarga
            }
        }));

        return downloadLinks;
    } catch (error) {
        HandleError(v1(), error.message, 'auxiliary functions/getFiles/GetLinksDownloadFiles', error, 'user');
    }
}