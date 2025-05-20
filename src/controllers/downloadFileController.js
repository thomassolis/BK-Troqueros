import path from 'path';
import fs from 'fs';
import { HandleError } from "../utils/HandleError.js";
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { BuildPathFilesServer } from '../fileManager/getFilePath.js';

// Rutas permitidas
const BASE_PATHS = {
    adjuntos: BuildPathFilesServer(),
};

export const CtrPreviewFile = async (req, res) => {
    try {
        const ruta = req.params;

        // Validamos que el request params no esté vacío
        if (!ruta) {
            return res.status(400).json({ success: false, message: 'Solicitud no válida, falta información.' });
        }

        // Construimos la ruta completa del archivo
        const file = path.join(BASE_PATHS.adjuntos, ruta.folder, ruta.subfolderId, ruta.subfolder, ruta.fileName);

        // Verificamos si el archivo existe
        if (!fs.existsSync(file)) {
            return res.status(404).json({ success: false, message: 'Archivo no encontrado.' });
        }

        // Obtenemos la extensión del archivo
        const fileExtension = path.extname(file).toLowerCase();
        let contentType;

        // Definimos el tipo de contenido según la extensión del archivo
        switch (fileExtension) {
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.gif':
            case '.bmp':
            case '.webp':
            case '.jfif':
                contentType = 'image/jpeg';
                break;
            default:
                contentType = 'application/octet-stream';
        }

        // Configuramos los encabezados para previsualización
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');

        // Enviar el archivo como flujo (stream)
        const readStream = fs.createReadStream(file);
        readStream.pipe(res);

    } catch (error) {
        const code = GenerateCodeError(modules.FILE, typeError.rutaNoEncontrada);
        HandleError(code, error.message, 'controllers/downloadFileController/CtrPreviewFile', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el archivo para previsualización' });
    }
};
