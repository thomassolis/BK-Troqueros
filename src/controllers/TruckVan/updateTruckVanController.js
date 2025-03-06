import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { UpdateTruckVan } from '../../querys/TruckVan/updateTruckVan.js';

//controlador para actualizar los datos del furgon
export const CtrUpdateTruckVan = async (req, res) => {
    try {
        const dataTruckVan = req.body; //obtiene los datos del request body
        const files = req.files; //obtiene todos los archivos del request files

        //valida que los datos no sean nulos
        if (!dataTruckVan) {
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        //Actualiza el furgon
        const updatedTruckVan = await UpdateTruckVan(dataTruckVan, files);

        //valida que el furgon se haya actualzido
        if (!updatedTruckVan) {
            return res.status(400).json({success: false, message: 'No se pudo actualizar el furgon.'});
        }

        return res.status(200).json({success: true, message: 'Furgon actualizado.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckVan/updateTruckVanController/CtrUpdateTruckVan');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}