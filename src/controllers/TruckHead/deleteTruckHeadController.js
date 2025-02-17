import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { DeleteTruckHead } from '../../querys/TruckHead/deleteTruckHead.js';

export const CtrDeleteTruckHead = async (req, res) => {
    try {
        //obtiene el id del cabezal del request params
        const idCabezal = req.params.id;

        //valida que el id del cabezal no sea nulo
        if (!idCabezal) {
            return res.status(404).json({success: false, message: 'Cabezal inválido.'});
        }

        //elimina el cabezal del sistema
        const deletedCabezal = await DeleteTruckHead(idCabezal);

        //valida que el cabezal se haya eliminado
        if (!deletedCabezal) {
            return res.status(404).json({success: false, message: 'Cabezal no encontrado.'});
        }

        return res.status(200).json({success: true, message: 'Cabezal eliminado correctamente.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/deleteTruckHeadController/CtrDeleteTruckHead', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}