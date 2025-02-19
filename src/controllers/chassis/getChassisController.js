import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetChassis, GetChassisByFilter } from '../../querys/Chassis/getChassis.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassis = async (req, res) => {
    try {
        //obtenemos el numero de pagina, sino existe se le asigna 1
        const page = parseInt(req.query.page) || 1;

        //obtenemos la palabra a buscar, sino existe se le asigna una cadena vacía
        const search = req.query.search;

        if (search) {
            //obtiene los chasis filtrados
            const chassis = (await GetChassisByFilter(1, search)).flat();

            //valida que los chasis no esten nulos
            if (chassis.length === 0) {
                return res.status(200).json({success: false, message: 'No se encontraron resultados.'});
            }

            return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
        }

        //obtiene toda la data del chasis y reduce el anidamiento
        const chassis = (await GetChassis(page)).flat();

        //verifica que chasis no este nulo
        if (chassis.length === 0) {
            return res.status(200).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}