import fs from 'fs';
import path from 'path';

//guardamos el archivo
export const SaveFile = (PATH, folder, file) =>{
    try {
        // Establecer la ruta donde se guardará el archivo
        const directory = path.join(PATH, folder);
        const pathAbsolut = path.join(directory, file.name);

        // Comprobar si la carpeta existe, y si no, crearla
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Mover el archivo desde el almacenamiento temporal a la carpeta chasis
        file.mv(pathAbsolut, (err) => {
            if (err) {
                return false;
            }

            return true;
        });
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/insertChassisController/SaveFile', error, 'user');
        throw new Error(`No se pudo guardar el archivo, ${error.message}`);
    }
}