import fs from 'fs';
import path from 'path';
import { HandleError } from '../utils/HandleError.js';
import { v1 } from 'uuid';
import { fileURLToPath } from 'url';

// Obtén la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtén el directorio del archivo actual
const __dirname = path.dirname(__filename);

//rutas permitidas
const BASE_PATHS = {
    adjuntos: path.join(__dirname, '../adjuntos/'),
};

export const ValidatePathMiddleware = (req, res, next) => {
    try {
        const ruta = req.params

        if (!ruta) {
            return res.status(500).json({ success: false, message: 'UPS... Ha ocurrido un error' });
        }

        //construimos la ruta completa
        const file = path.join(BASE_PATHS.adjuntos, ruta.folder, ruta.subfolder, ruta.fileName);

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
        HandleError(v1(), error.message, 'middlewares/validatePath.middleware/ValidatePathMiddleware', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}
