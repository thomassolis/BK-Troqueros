import { HandleError } from '../../utils/HandleError.js';
import { GetTruckHeadId } from '../../querys/TruckHead/getTruckHeadId.js';
import { DateConverterSQL } from '../../auxiliary functions/dateConverter.js';
import { GetLinksPreviewFiles } from '../../fileManager/getFiles.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los cabezales que hay en el sistema
export const CtrGetTruckHeadId = async (req, res) => {
    try {
        const protocol = req.protocol; //protocolo => http ó https
        const host = req.get('host'); //localhost:puerto
        const linkDownload = `${protocol}://${host}/api/preview`;

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
        //obtiene los links de descarga de los archivos existentes
        const truckHead = {
            ...data,  // Mantiene todos los demás datos de la fila sin cambios
            fecha_expedicion_poliza: DateConverterSQL(data.fecha_expedicion_poliza),
            fecha_caducidad_poliza: DateConverterSQL(data.fecha_caducidad_poliza),
            fecha_renovacion_revisado: DateConverterSQL(data.fecha_renovacion_revisado),
            fecha_ultimo_revisado: DateConverterSQL(data.fecha_ultimo_revisado),
            foto_poliza: GetLinksPreviewFiles(linkDownload, data.foto_poliza),
            foto_revisado: GetLinksPreviewFiles(linkDownload, data.foto_revisado),
        };

        return res.status(200).json({success: true, message: 'Data enviada', data: truckHead});
    } catch (error) {
        const code = GenerateCodeError(modules.CABEZALES, typeError.CABEZALES.GET);
        HandleError(code, error.message, 'controllers/TruckHead/getTruckHeadController/CtrGetTruckHeadId', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}