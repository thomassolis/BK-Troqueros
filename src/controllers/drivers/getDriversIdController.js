import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetLinksPreviewFiles } from '../../fileManager/getFiles.js';
import { GetDriverByID } from '../../querys/drivers/getDriverID.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';



export const Ctr_GetDriverById = async (req, res) => {
    try {
        const protocol = req.protocol; //protocolo => http ó https
        const host = req.get('host'); //localhost:puerto
        const linkPreview = `${protocol}://${host}/api/preview`; // Construimos el link de descarga
        const idDriver = req.params.id; // Obtiene el ID del conductor

        // Valida que el Id del cliente exista
        if (!idDriver) {
            return res.status(401).json({ success: false, message: 'Ha ocurrido un error al obtener la información del conductor. Identificador no proporcionado.' })
        }

        const driver = await GetDriverByID(idDriver);

        // Valida si hay datos del conductor
        if (!driver) {
            return res.status(404).json({ success: false, message: 'Conductor no encontrado.' })
        }

        const data = {
            ...driver,
            licencia: GetLinksPreviewFiles(linkPreview, driver.licencia),
            pazSalvo: GetLinksPreviewFiles(linkPreview, driver.pazSalvo),
            record_policivo: GetLinksPreviewFiles(linkPreview, driver.record_policivo)
        }

        return res.status(200).json({ success: true, message: 'Data enviada.', data })
    } catch (error) {
        const code = GenerateCodeError(modules.DRIVERS, typeError.DRIVERS.GET);
        HandleError(code, error.message, 'controllers/drivers/getDriversIdController/Ctr_GetDriverById', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}