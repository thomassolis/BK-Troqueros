import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { DeleteClient } from '../../querys/clients/deleteClient.js';


export const Ctr_DeleteClient = async (req, res) => {
    try {
        const idClient = req.params.id        
        // Valida que id del cliente exista
        if (!idClient) {
            return res.status(401).json({ success: false, message: 'No se ha podido eliminar al cliente. Identificador no proporcionado' })
        }

        const deleted = await DeleteClient(idClient) // Elimina un cliente logicamente

        // Valida si el cliente ha sido eliminado
        if (!deleted) {
            return res.status(401).json({ success: false, message: 'Cliente no encontrado' })
        }

        return res.status(200).json({ success: true, message: 'Cliente eliminado satisfactoriamnete!' })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.DELETE);
        HandleError(code, error.message, 'controllers/clients/deleteClientController/Ctr_DeleteClient', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}