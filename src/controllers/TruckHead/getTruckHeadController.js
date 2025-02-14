import { v1 } from 'uuid'
import { HandleError } from '../../utils/HandleError.js'
import { GetTruckHead } from '../../querys/TruckHead/getTruckHead.js';

export const CtrGetTruckHead = async (req, res) => {
    try {
        const dataHeadTruck = await GetTruckHead();

        const truckHead = dataHeadTruck.flat();

        if (!truckHead) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckHead});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/getTruckHeadController/CtrGetTruckHead', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}