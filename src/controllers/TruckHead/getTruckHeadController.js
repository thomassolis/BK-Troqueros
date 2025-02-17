import { v1 } from 'uuid'
import { HandleError } from '../../utils/HandleError.js'
import { GetTruckHead } from '../../querys/TruckHead/getTruckHead.js';

//Obtiene todos los cabezales que hay en el sistema
export const CtrGetTruckHead = async (req, res) => {
    try {
        //obtiene toda la data del cabezal y reduce el anidamiento
        const truckHead = (await GetTruckHead()).flat();

        //valida que el no sea nulo
        if (!truckHead) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckHead});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/getTruckHeadController/CtrGetTruckHead', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}