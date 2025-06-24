import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { UpdateClient } from '../../querys/clients/updateClient.js';


export const Ctr_UpdateClient = async (req, res) => {
    try {
        const data = req.body; // Obtenemos la información del cliente
        const files = req.files || {}; // Obtenemos los archivos del cliente
        console.log('Data a actulizar', data);
        const updated = await UpdateClient(data, files) // Actualiza la información del cliente

        // Valida que se haya actualizado la información del cliente
        if (!updated) {
            return res.status(401).json({ success: false, message: 'No se ha podido actualizar la información del cliente. Inténtelo más tarde' })
        }

        return res.status(200).json({ success: true, message: 'La información del cliente ha sido actualizada' })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.PUT);

        //Valida si el error ocurrido sea por insertar una placa ya registrada
        if (error.ErrorCode === 2627) {
            HandleError(code, error.message, 'controllers/clients/updateClientController/Ctr_UpdateClient', error);
            return res.status(500).json({success: false, message: error.message});
        }
        
        HandleError(code, error.message, 'controllers/clients/updateClientController/Ctr_UpdateClient', error);
        return res.status(500).json({ success: false, message: `${error.message}. Inténtelo más tarde` })
    }
}