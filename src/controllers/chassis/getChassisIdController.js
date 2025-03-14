import { HandleError } from '../../utils/HandleError.js';
import { GetChassisId } from '../../querys/Chassis/getChassisId.js';
import { DateConverter } from '../../auxiliary functions/dateConverter.js';
import { GetLinksDownloadFiles } from '../../fileManager/getFiles.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//Obtiene todos los chasis que hay en el sistema
export const CtrGetChassisId = async (req, res) => {
    try {
        const protocol = req.protocol; //protocolo => http ó https
        const host = req.get('host'); //localhost:puerto
        const linkDownload = `${protocol}://${host}/api/download`;

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
            foto_poliza: GetLinksDownloadFiles(linkDownload, data.foto_poliza),
            foto_revisado: GetLinksDownloadFiles(linkDownload, data.foto_revisado),
        };

        return res.status(200).json({success: true, message: 'Data enviada', data: chassis});
    } catch (error) {
        const typError = req.method; //obtenemos el metodo para poder identificar el tipo de error
        const module = req.baseUrl.split('/')[2].toUpperCase(); //obtiene el modulo
        const code = GenerateCodeError(modules[module], typeError[module]?.[typError]);
        HandleError(code, error.message, 'controllers/chassis/getChassisController/CtrGetChassis', error);
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}