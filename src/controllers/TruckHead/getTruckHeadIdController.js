import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetTruckHeadId } from '../../querys/TruckHead/getTruckHeadId.js';
import { DateConverter } from '../../auxiliary functions/dateConverter.js';

//Obtiene todos los cabezales que hay en el sistema
export const CtrGetTruckHeadId = async (req, res) => {
    try {
        //obtiene el id del cabezal
        const idTruckHead = req.params.id;

        //valida que el id del cabezal no sea nulo
        if (!idTruckHead) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del cabezal'});
        }

        //obtiene la info del cabezal y reduce el anidamiento del array
        const data = await GetTruckHeadId(idTruckHead);

        //verifica que chasis no este nulo
        if (!data) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        //obtiene la data con las fechas formateas (DD/MM/YYYY)
        const truckHead = {
                    ...data,  // Mantiene todos los demás datos de la fila sin cambios
                    fecha_expedicion_poliza: DateConverter(data.fecha_expedicion_poliza),
                    fecha_caducidad_poliza: DateConverter(data.fecha_caducidad_poliza),
                    fecha_renovacion_revisado: DateConverter(data.fecha_renovacion_revisado),
                    fecha_ultimo_revisado: DateConverter(data.fecha_ultimo_revisado),
                };

        return res.status(200).json({success: true, message: 'Data enviada', data: truckHead});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckHead/getTruckHeadController/CtrGetTruckHeadId', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}