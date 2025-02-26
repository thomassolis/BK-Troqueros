import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { UpdateChassis } from '../../querys/Chassis/updateChassis.js';
import { DeleteFile } from '../../fileManager/deleteFile.js';

//controlador para actualizar los datos del chasis
export const CtrUpdateChassis = async (req, res) => {
    try {
         //nombre de las carpetas a guardar los archivos
         const folders = ['chassis', 'poliza', 'revisado'];

        const dataChassis = req.body; //obtiene los datos del request body
        const files = req.files; //obtiene todos los archivos del request files

        //valida que los datos no sean nulos
        if (!dataChassis) {
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //valida que files exista
        if (!files) {}

        //Actualiza el chasis
        const updatedChassis = await UpdateChassis(dataChassis, folders, files);

        //valida que el chasis se haya actualzido
        if (!updatedChassis) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el chasis.'});
        }

        return res.status(200).json({success: true, message: 'Chasis actualizado.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/updateChassisController/CtrUpdateChassis');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}