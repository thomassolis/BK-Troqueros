
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetClientById } from '../../querys/clients/getClientId.js';
import { GetLinksDownloadFiles } from '../../fileManager/getFiles.js';
import { DateConverter } from '../../auxiliary functions/dateConverter.js';


// Controlador para obtener la información de un cliente
export const Ctr_GetClientsById = async (req, res) => {
    try {
        const protocol = req.protocol; //protocolo => http ó https
        const host = req.get('host'); //localhost:puerto
        const linkDownload = `${protocol}://${host}/api/download`;
        const id = req.params.id

        // Valida que el Id del cliente exista
        if (!id) {
            return res.status(401).json({ success: false, message: 'Ha ocurrido un error al obtener la información del cliente' })
        }

        const client = await GetClientById(id) // Obtiene la información del cliente solicitado

        // Valida si el cliente existe
        if (!client) {
            return res.status(404).json({ success: false, message: 'El cliente solicitado no existe' })
        }

        const data = {
            ...client,
            fechaUltimoPedido: DateConverter(client.fechaUltimoPedido),
            cedRepresentanteLegal: GetLinksDownloadFiles(linkDownload, client.cedRepresentanteLegal),
            avisoOperaciones: GetLinksDownloadFiles(linkDownload, client.avisoOperaciones),
            cedPersonaNatural: GetLinksDownloadFiles(linkDownload, client.cedPersonaNatural)
        }

        return res.status(200).json({ success: true, message: 'Data Enviada', data })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.GET);
        HandleError(code, error.message, 'controllers/clients/getClientIDController/Ctr_GetClientsById', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}