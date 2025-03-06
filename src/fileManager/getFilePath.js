import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

//construye la ruta donde van a estar alojados los archivos del sistema
export const BuildPathFilesServer = () => {
    // Convertimos la URL del archivo actual (import.meta.url) a una ruta de archivo
    const __filename = fileURLToPath(import.meta.url);
    
    // Usamos dirname para obtener el directorio donde se encuentra el archivo actual
    const __dirname = dirname(__filename);
    
    //obtenemos la ruta absoluta del directorio a usar
    return path.resolve(__dirname, `../adjuntos`);
}