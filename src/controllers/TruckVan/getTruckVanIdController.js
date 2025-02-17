import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetTruckVan } from '../../querys/TruckVan/getTruckVan.js';
import { GetTruckVanId } from '../../querys/TruckVan/getTruckVanId.js';

//Obtiene el furgon por ID
export const CtrGetTruckVanId = async (req, res) => {
    try {
        //obtiene el id del furgon
        const idTruckVan = req.params.id;

        //valida que el id del furgon no sea nulo
        if (!idTruckVan) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del cabezal'});
        }

        //obtiene la info del furgon
        const truckVan = await GetTruckVanId(idTruckVan);

        //verifica que chasis no este nulo
        if (!truckVan) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckVan});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckVan/getTruckVanController/CtrGetTruckVanId', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}