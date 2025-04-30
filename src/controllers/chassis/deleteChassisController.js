import { HandleError } from '../../utils/HandleError.js';
import { DeleteChassis } from '../../querys/Chassis/deleteChassis.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

export const CtrDeleteChassis = async (req, res) => {
    try {
        //obtiene el id del chasis del request params
        const id_chassis = req.params.id;        
        console.log('id_chassis',id_chassis)

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
        console.log(error);
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/chassis/deleteChassisController/CtrDeleteChassis', error);
        return res.status(500).json({success: false, message: 'Error al eliminar'});
    }
}