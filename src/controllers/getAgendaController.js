import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';
import { GetAgendaEntregaVacio } from '../querys/agenda/getAgendaEntregaVacio.js';
import { GetAgendaPeticion } from '../querys/agenda/getAgendaPeticion.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { HandleError } from '../utils/HandleError.js';


export const Ctr_GetAgenda = async (req, res) => {
    try {
        const agenda = [
            ...(await GetAgendaEntregaVacio()), // Obtiene la agenda de los servicios de entrega vacio
            ...(await GetAgendaPeticion()) // Obtiene la agenda de las peticiones
        ]

        return res.status(200).json({ success: true, message: 'Data Enviada', data: agenda })
    } catch (error) {
        const code = GenerateCodeError(modules.AGENDA, typeError.agendaNoEncontrada);
        HandleError(code, error.message, 'controllers/agenda/getAgendaController/Ctr_GetAgenda', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}