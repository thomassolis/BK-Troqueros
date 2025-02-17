import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetTruckVan } from '../../querys/TruckVan/getTruckVan.js';

//Obtiene todos los furgones que hay en el sistema
export const CtrGetTruckVan = async (req, res) => {
    try {
        //obtiene toda la data del furgones y reduce el anidamiento
        const truckVan = (await GetTruckVan()).flat();

        //valida que no sea nulo
        if (!truckVan) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckVan});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/getTruckVanController/CtrGetTruckVan', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}