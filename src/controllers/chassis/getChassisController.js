import { HandleError } from '../../utils/HandleError.js';
import { GetChassis, GetChassisByFilter } from '../../querys/Chassis/getChassis.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassis = async (req, res) => {
    try {
        console.log(req.query.page)
        //obtenemos la palabra a buscar, sino existe se le asigna una cadena vacía
        const search = req.query.search;
        // Obtiene el número de página (si no hay búsqueda, mantiene la paginación actual)
        const page = search ? 1 : parseInt(req.query.page) || 1;

        if (search) {
            //obtiene los chasis filtrados
            const chassis = await GetChassisByFilter(page, search);

            //valida que los chasis no esten nulos
            if (!chassis) {
                return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
            }

            return res.status(200).json({success: true, message: 'Data enviada', vehiculos: chassis});
        }

        //obtiene toda la data del chasis y reduce el anidamiento
        const chassis = await GetChassis(page);

        //verifica que chasis no este nulo
        if (!chassis) {
            return res.status(200).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', vehiculos: chassis});
    } catch (error) {
        const code = GenerateCodeError(modules.CHASISES, typeError.CHASISES.GET);
        HandleError(code, error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}