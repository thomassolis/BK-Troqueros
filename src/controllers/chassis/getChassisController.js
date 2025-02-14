import { v1 } from 'uuid'
import { HandleError } from '../../utils/HandleError.js'
import { GetChassis } from '../../querys/Chassis/getChassis.js'

export const CtrGetChassis = async (req, res) => {
    try {
        const dataChassis = await GetChassis();

        const chassis = dataChassis.flat();

        if (!chassis) {
            return res.status(404).json({success: true, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}