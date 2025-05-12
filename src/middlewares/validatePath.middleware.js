import fs from 'fs';
import path from 'path';
import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { BuildPathFilesServer } from '../fileManager/getFilePath.js';

//rutas permitidas
const BASE_PATHS = {
    adjuntos: BuildPathFilesServer(),
};

export const ValidatePathMiddleware = (req, res, next) => {
    try {
        const ruta = req.params

        if (!ruta) {
            return res.status(500).json({ success: false, message: 'UPS... Ha ocurrido un error' });
        }

        //construimos la ruta completa
        const file = path.join(BASE_PATHS.adjuntos, ruta.folder, ruta.subfolderId, ruta.subfolder, ruta.fileName);

        // Verificar si la carpeta está dentro de las rutas permitidas
        if (!file.startsWith(BASE_PATHS.adjuntos)) {
            return res.status(403).json({ success: false, message: 'Acceso denegado' });
        }

        //validamos que el archivo exista
        fs.access(file, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
            }
            
            next();
        });
    } catch (error) {
        const code = GenerateCodeError(modules.FILE, typeError.rutaNoEncontrada);
        HandleError(code, error.message, 'middlewares/validatePath.middleware/ValidatePathMiddleware', error);
        return res.status(500).json({success: false, message: 'Error al obtener los archivos'});
    }
}
