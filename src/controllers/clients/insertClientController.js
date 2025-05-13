import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { InsertClient } from '../../querys/clients/insertClient.js';
import { ValidateRUC_Client } from '../../querys/clients/validateRUC.js';


// Controlador para agregar un nuevo cliente
export const Ctr_InsertClient = async (req, res) => {
    try {
        const newClient  = req.body // Obtenemos los datos del nuevo cliente
        const files = req.files

        // Valida que los datos del nuevo cliente exista
        if (!newClient) {
            return res.status(401).json({ success: false, message: 'Ha ocurrido un error al crear al cliente. Intente más tarde' })
        }

        const exist = await ValidateRUC_Client(newClient.ruc) // Valida si el RUC del cliente ya se encuentra registrado en el sistema

        // Valida si el RUC del cliente se encuentra en la base de datos
        if (exist) {
            return res.status(401).json({ success: false, message: 'Ya existe un cliente registrado con ese RUC.' })
        }

        const created = await InsertClient(newClient, files) // Crea el nuevo cliente

        // Valida que se haya creado el nuevo cliente
        if (!created) {
            return res.status(401).json({ success: false, message: 'No se pudo crear el cliente' })
        }

        return res.status(201).json({ success: true, message: 'Cliente creado satisfactoriamente!' })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.GET);
        HandleError(code, error.message, 'controllers/clients/getInsertClientController/Ctr_InsertClient', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}