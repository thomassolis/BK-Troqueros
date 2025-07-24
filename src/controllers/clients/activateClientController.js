import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { ActivateClient } from '../../querys/clients/activateClient.js';


export const Ctr_ActivateClient = async (req, res) => {
    try {
        const client = req.body;

        // Validamos que el cliente no sea undefined
        if (!client || !Object.keys(client).length) {
            return res.status(400).json({ success: false, message: 'Datos no proporcionados. Inténtelo más tarde.' })
        }

        const activatedClient = await ActivateClient(client) // Actualiza la información del cliente

        // Validamos que se haya habilitado/deshabilitado el cabezal
        if (!activatedClient) {
            return res.status(400).json({ success: false, message: client.active ? 'No se pudo habilitar el cliente.' : 'No se pudo deshabilitar el cliente.' })
        }

        return res.status(200).json({ success: true, message: client.active ? 'Cliente habilitado.' : 'Cliente deshabilitado.' })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.PATCH);        
        HandleError(code, error.message, 'controllers/clients/activateClientController/Ctr_ActivateClient', error);
        return res.status(500).json({ success: false, message: `${error.message}. Inténtelo más tarde` })
    }
}