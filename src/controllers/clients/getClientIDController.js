
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetClientById } from '../../querys/clients/getClientId.js';


// Controlador para obtener la información de un cliente
export const Ctr_GetClientsById = async (req, res) => {
    try {
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

        return res.status(200).json({ success: true, message: 'Data Enviada', data: client })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTES, typeError.CLIENTES.GET);
        HandleError(code, error.message, 'controllers/clients/getClientIDController/Ctr_GetClientsById', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}