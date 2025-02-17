import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { DeleteChassis } from '../../querys/Chassis/deleteChassis.js';

export const CtrDeleteChassis = async (req, res) => {
    try {
        //obtiene el id del chasis del request params
        const id_chassis = req.params.id;

        //valida que el id del chasis no sea nulo
        if (!id_chassis) {
            return res.status(404).json({success: false, message: 'Chasis inválido.'});
        }

        //elimina el chasis del sistema
        const deletedChassis = await DeleteChassis(id_chassis);

        //valida que el chasis se haya eliminado
        if (!deletedChassis) {
            return res.status(404).json({success: false, message: 'Chasis no encontrado.'});
        }

        return res.status(200).json({success: true, message: 'Chasis eliminado correctamente.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/deleteChassisController/CtrDeleteChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}