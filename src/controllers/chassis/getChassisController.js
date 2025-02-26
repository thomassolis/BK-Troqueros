import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetChassis, GetChassisByFilter } from '../../querys/Chassis/getChassis.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassis = async (req, res) => {
    try {
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

            return res.status(200).json({success: true, message: 'Data enviada', chassis});
        }

        //obtiene toda la data del chasis y reduce el anidamiento
        const chassis = await GetChassis(page);

        //verifica que chasis no este nulo
        if (!chassis) {
            return res.status(200).json({success: false, message: 'No hay resultados'});
        }

        return res.status(200).json({success: true, message: 'Data enviada', vehiculos: chassis});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}