import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { GetTruckVanId } from '../../querys/TruckVan/getTruckVanId.js';
import { DateConverter } from '../../auxiliary functions/dateConverter.js';

//Obtiene el furgon por ID
export const CtrGetTruckVanId = async (req, res) => {
    try {
        //obtiene el id del furgon
        const idTruckVan = req.params.id;

        //valida que el id del furgon no sea nulo
        if (!idTruckVan) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos del cabezal'});
        }

        //obtiene la info del furgon
        const data = await GetTruckVanId(idTruckVan);

        //verifica que chasis no este nulo
        if (!data) {
            return res.status(404).json({success: false, message: 'No se pudo obtener los datos'});
        }

        //obtiene la data con las fechas formateas (DD/MM/YYYY)
        const truckVan = {
            ...data,  // Mantiene todos los demás datos de la fila sin cambios
            fecha_expedicion_poliza: DateConverter(data.fecha_expedicion_poliza),
            fecha_caducidad_poliza: DateConverter(data.fecha_caducidad_poliza),
            fecha_renovacion_revisado: DateConverter(data.fecha_renovacion_revisado),
            fecha_ultimo_revisado: DateConverter(data.fecha_ultimo_revisado),
        };

        return res.status(200).json({success: true, message: 'Data enviada', data: truckVan});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/TruckVan/getTruckVanController/CtrGetTruckVanId', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}