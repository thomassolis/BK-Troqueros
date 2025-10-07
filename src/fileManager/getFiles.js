import fs from 'fs';
import path from 'path';
import { HandleError } from '../utils/HandleError.js';
import { BuildPathFilesServer } from './getFilePath.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { typeError } from '../dictionary/typeError.js';
import { modules } from '../dictionary/modules.js';
import { BuildPathRequestFilesServer } from './BuildPathRequestFilesServer.js';
export const GetLinksDownloadFiles = (linkDownload, linkComplementary, module) => {
    try {                
        //valida que la ruta fisica exista
        if (!linkComplementary) {
            return null;
        }

        //obtiene la ruta base
        let BASE_PATHS;

        if(module === 'Peticiones'){
            BASE_PATHS = BuildPathRequestFilesServer();
        }else{
            BASE_PATHS = BuildPathFilesServer();
        }                        
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
                ext: path.extname(file), // Extensión del archivo
                url: `${linkDownload}/${linkComplementary}/${file}` // URL de descarga
            }
        }));

        // ✅ lista PLANA: un objeto por archivo, con su URL ÚNICA
        const requestDownloadLinks = files.map((file) => {
        // usa separadores POSIX para la URL y codifica cada segmento
        const safeUrl = [
            String(linkDownload).replace(/\/+$/, ""), // sin trailing slash
            ...String(linkComplementary).split(/[\\/]+/).filter(Boolean).map(encodeURIComponent),
            encodeURIComponent(file),
        ].join("/");

        return {
            name: file,                         // "MANUAL_DE_USUARIO_TROQUEROS.pdf"
            ext: path.extname(file).slice(1),   // "pdf"
            url: `${safeUrl.replace(/^\/+/, "")}` // "/api/preview/.../archivo.pdf" o "/uploads/.../archivo.pdf"
        };
        });


        

        if (module === "Peticiones") {
            return requestDownloadLinks;
        }
            return downloadLinks;

    } catch (error) {
        const code = GenerateCodeError(modules.FILE, typeError.general);
        HandleError(code, error.message, 'auxiliary functions/getFiles/GetLinksDownloadFiles', error);
        throw new Error('Error al obtener los links de descargas de los archivos.');        
    }
}

// Obtiene el link para previsualizar el archivo
export const GetLinksPreviewFiles = (linkPreview, linkComplementary) => {
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
                ext: path.extname(file), // Extensión del archivo
                url: `${linkPreview}/${linkComplementary}/${file}` // URL de previsualización
            }
        }));

        return downloadLinks;
    } catch (error) {
        const code = GenerateCodeError(modules.FILE, typeError.general);
        HandleError(code, error.message, 'auxiliary functions/getFiles/GetLinksPreviewFiles', error);
        throw new Error('Error al obtener los links de previsualización de los archivos.');        
    }
}