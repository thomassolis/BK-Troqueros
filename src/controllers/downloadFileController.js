import path from 'path';
import { HandleError } from "../utils/HandleError.js"
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { BuildPathFilesServer } from '../fileManager/getFilePath.js';

//rutas permitidas
const BASE_PATHS = {
    adjuntos: BuildPathFilesServer(),
};

export const CtrDownloadFile = async (req, res) => {
    try {
        const ruta = req.params;

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
        const code = GenerateCodeError(modules.FILE, typeError.rutaNoEncontrada);
        HandleError(code, error.message, 'controllers/downloadFileController/CtrDownloadFile', error);
        return res.status(500).json({success: false, message: 'Error al obtener los archivos'});
    }
}