import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetChassisId } from '../../querys/Chassis/getChassisId.js';
import { DateConverter } from '../../auxiliary functions/dateConverter.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassisId = async (req, res) => {
    try {
        //obtiene el id del chasis
        const idChassis = req.params.id;

        //valida que el id del chasis no sea nulo
        if (!idChassis) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del chasis'});
        }

        //obtiene la info del chasis y reduce el anidamiento del array
        const data = await GetChassisId(idChassis);

        //verifica que chasis no este nulo
        if (!data) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        const chassis = {
            ...data,  // Mantiene todos los demás datos de la fila sin cambios
            fecha_expedicion_poliza: DateConverter(data.fecha_expedicion_poliza),
            fecha_caducidad_poliza: DateConverter(data.fecha_caducidad_poliza),
            fecha_renovacion_revisado: DateConverter(data.fecha_renovacion_revisado),
            fecha_ultimo_revisado: DateConverter(data.fecha_ultimo_revisado),
        };

        return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}