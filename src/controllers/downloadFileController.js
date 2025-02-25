import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { HandleError } from "../utils/HandleError.js"
import { v1 } from 'uuid';

// Obtén la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtén el directorio del archivo actual
const __dirname = path.dirname(__filename);

//rutas permitidas
const BASE_PATHS = {
    adjuntos: path.join(__dirname, '../adjuntos/'),
};

export const CtrDownloadFile = async (req, res) => {
    try {
        const ruta = req.params

        //validamos que el request params no este vacío
        if (!ruta) {
            return res.status(500).json({ success: false, message: 'UPS... Ha ocurrido un error' });
        }

        //construimos la ruta completa
        const file = path.join(BASE_PATHS.adjuntos, ruta.folder, ruta.subfolderId, ruta.subfolder, ruta.fileName);
        
        //descargamos el archivo
        res.download(file, (err) => {
            if (err) {
                console.log(err.message)
                return res.status(500).json({ success: false, message: 'Error al intentar descargar el archivo' });
            }
        });
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/downloadFileController/CtrDownloadFile', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}