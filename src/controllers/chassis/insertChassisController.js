import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { InsertChassis } from '../../querys/Chassis/insertChassis.js';

//controlado para insertar chasis
export const CtrInsertChassis = async (req, res) => {
    try {
        // Convertimos la URL del archivo actual (import.meta.url) a una ruta de archivo
        const __filename = fileURLToPath(import.meta.url);

        // Usamos dirname para obtener el directorio donde se encuentra el archivo actual
        const __dirname = dirname(__filename);

        // Usamos path.resolve para obtener la ruta absoluta de la carpeta "chassis"
        const PATH = path.resolve(__dirname, '../../adjuntos/chassis');

        //obtiene los datos del request body
        const chassis = req.body;
        const file = req.files;

        //valida que los datos no sean nulos
        if (!chassis){
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //valida que la foto de la poliza exista
        if (!file) {
            return res.status(400).json({success: false, message: 'Ingrese la foto de la poliza'});
        }

        const inserted = await InsertChassis(chassis, PATH, file.foto); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el chasis.'});
        }

        return res.status(201).json({success: true, message: 'Chasis insertado.'});
    } catch (error) {
        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            return res.status(500).json({success: false, message: error.msg});
        }

        HandleError(v1(), error.message, 'controllers/chassis/insertChassisController/CtrInsertChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}


