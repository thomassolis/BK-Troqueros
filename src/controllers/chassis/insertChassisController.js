import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { InsertChassis } from '../../querys/Chassis/insertChassis.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//controlado para insertar chasis
export const CtrInsertChassis = async (req, res) => {
    try {
        console.log(req.body);
        //obtiene los datos del request body
        const chassis = req.body;
        var file = req.files;

        const inserted = await InsertChassis(chassis, file); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el chasis.'});
        }

        return res.status(201).json({success: true, message: 'Chasis insertado.'});
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.POST);

        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/chassis/insertChassisController/CtrInsertChassis', error);
            return res.status(500).json({success: false, message: error.message});
        }

        HandleError(code, error.message, 'controllers/chassis/insertChassisController/CtrInsertChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}
