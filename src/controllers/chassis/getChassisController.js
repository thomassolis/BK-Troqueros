import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetChassis } from '../../querys/Chassis/getChassis.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassis = async (req, res) => {
    try {
        //obtiene toda la data del chasis y reduce el anidamiento
        const chassis = (await GetChassis()).flat();

        //verifica que chasis no este nulo
        if (!chassis) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}