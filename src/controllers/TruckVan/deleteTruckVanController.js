import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { DeleteTruckVan } from '../../querys/TruckVan/deleteTruckVan.js';

export const CtrDeleteTruckVan = async (req, res) => {
    try {
        //obtiene el id del furgon del request params
        const idFurgon = req.params.id;

        //valida que el id del furgon no sea nulo
        if (!idFurgon) {
            return res.status(404).json({success: false, message: 'Furgon inválido.'});
        }

        //elimina el furgon del sistema
        const deletedFurgon = await DeleteTruckVan(idFurgon);

        //valida que el furgon se haya eliminado
        if (!deletedFurgon) {
            return res.status(404).json({success: false, message: 'Furgon no encontrado.'});
        }

        return res.status(200).json({success: true, message: 'Furgon eliminado correctamente.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckVan/deleteTruckVanController/CtrDeleteTruckVan', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}