import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetTruckHeadId } from '../../querys/TruckHead/getTruckHeadId.js';

//Obtiene todos los cabezales que hay en el sistema
export const CtrGetTruckHeadId = async (req, res) => {
    try {
        //obtiene el id del cabezal
        const idTruckHead = req.params.id;

        //valida que el id del cabezal no sea nulo
        if (!idTruckHead) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del cabezal'});
        }

        //obtiene la info del cabezal y reduce el anidamiento del array
        const truckHead = (await GetTruckHeadId(idTruckHead)).flat();

        //verifica que chasis no este nulo
        if (!truckHead) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: truckHead});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/getTruckHeadController/CtrGetTruckHeadId', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}