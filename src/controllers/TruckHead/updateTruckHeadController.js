import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { UpdateTruckHead } from '../../querys/TruckHead/updateTruckHead.js';

//controlador para actualizar los datos del cabezal
export const CtrUpdateTruckHead = async (req, res) => {
    try {
        //nombre de las carpetas a guardar los archivos
        const folders = ['cabezal', 'poliza', 'revisado'];

        const dataTruckHead = req.body; //obtiene los datos del request body
        const files = req.files; //obtiene todos los archivos del request files

        //valida que los datos no sean nulos
        if (!dataTruckHead) {
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //Actualiza el cabezal
        const updatedTruckHead = await UpdateTruckHead(dataTruckHead, folders, files);

        //valida que el cabezal se haya actualzido
        if (!updatedTruckHead) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el Cabezal.'});
        }

        return res.status(200).json({success: true, message: 'Cabezal actualizado.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/updateTruckHeadController/CtrUpdateTruckHead');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}