import { GetAllClients, GetClientsFilters } from '../../querys/clients/getClients.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';


// Controlador para obtener los clientes
export const Ctr_GetClients = async (req, res) => {
    try {
        console.log(req.query)
        //obtenemos la palabra a buscar
        const search = req.query.search;
        // Obtiene el número de página (si no hay búsqueda, mantiene la paginación actual)
        const page = search ? 1 : parseInt(req.query.page) || 1;

        let clients = null

        // Valida que 'search' tenga información a buscar
        if (search) {
            clients = await GetClientsFilters(page, search) // Obtiene los clientes filtrados
        } else {
            clients = await GetAllClients(page); // Obtiene todos los clientes del sistema
        }

        // Valida que los clientes no sean undefined
        if (!clients) {
            return res.status(404).json({ success: false, message: "No se ha podido obtener los clientes. Intente más tarde" })
        }

        return res.status(200).json({ success: true, message: "Data Enviada", customers: clients })
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTES, typeError.CLIENTES.GET);
        HandleError(code, error.message, 'controllers/clients/getClientsController/Ctr_GetClients', error);
        return res.status(500).json({ success: false, message: `${error.message}. Intentelo más tarde` })
    }
}