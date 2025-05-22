import { HandleError } from '../../utils/HandleError.js';
import { GetChassis, GetChassisByFilter } from '../../querys/Chassis/getChassis.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassis = async (req, res) => {
    try {
        const search = req.query.search; //obtenemos la palabra a buscar
        const page = parseInt(req.query.page) || 1; // Obtiene el número de página

        let chassis = null;

        // Valida si está filtrando
        if (search) {
            chassis = await GetChassisByFilter(page, search); //obtiene los chasis filtrados
        } else {
            chassis = await GetChassis(page); //obtiene toda la data del chasis y reduce el anidamiento
        }        

        //verifica que chasis no este nulo
        if (!chassis) {
            return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', vehiculos: chassis});
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}