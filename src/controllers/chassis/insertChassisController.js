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

        //valida que los datos no sean nulos
        if (!chassis){
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        const inserted = await InsertChassis(chassis, file); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo insertar el chasis.'});
        }

        return res.status(201).json({success: true, message: 'Chasis insertado.'});
    } catch (error) {
        console.log(error);
        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            return res.status(500).json({success: false, message: error.msg});
        }

        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/chassis/insertChassisController/CtrInsertChassis', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}
