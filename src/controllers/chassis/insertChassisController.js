import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { InsertChassis } from '../../querys/Chassis/insertChassis.js';

export const CtrInsertChassis = async (req, res) => {
    try {
        const chassis = req.body;

        if (!chassis){
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        const inserted = await InsertChassis(chassis);

        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el chasis.'});
        }

        return res.status(201).json({success: true, message: 'Chasis insertado.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/insertChassisController/CtrInsertChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}