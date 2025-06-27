import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { HandleError } from '../utils/HandleError.js';


// Valida la extensión de los archivos
export const Mdlware_ValidateFilesExt = (req, res, next) => {
    try {
        const allowedExtension = ['jpg', 'jpeg', 'png', 'pdf', 'jfif'];
        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes
        const files = req.files || {}; // Obtiene los archivos

        // Recorre el objeto de files
        // Valida que cada archivo cumpla con las extensiones permitidas
        for (const [_, file] of Object.entries(files)) {
            const name = file.name; // Obtiene el nombre del archivo
            const extension = name.substring(name.lastIndexOf('.') + 1).toLowerCase(); // Obtiene la extensión del archivo

            // Valida si la extensión es permitida
            if (!allowedExtension.includes(extension)) {
                return res.status(400).json({
                    success: false,
                    message: `La extensión del archivo ${name} no está permitida. Solo se aceptan archivos con extensión: .${allowedExtension.join(', .')}.`
                });
            }

            // Valida el tamaño del archivo
            if (file.size >= MAX_FILE_SIZE) {                
                return res.status(400).json({
                    success: false,
                    message: `El archivo ${name} supera el tamaño máximo permitido de 50MB.`
                });
            }
        }
        
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.FILE, typeError.validarFileExtension);
        HandleError(code, error.message, 'middlewares/validateFile.middleware/Mdlware_ValidateFilesExt', error);
        return res.status(500).json({ success: false, message: 'Ha ocurrido un error con la validación de los archivos. Inténtelo más tarde.' });
    }
}