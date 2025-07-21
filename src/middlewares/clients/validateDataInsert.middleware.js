import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaClient } from '../../schema/schemaClients.js';


export const MdlwareValidateDataInsertClient = (req, res, next) => {
    try {
        const data = req.body; // Obtenemos los datos de los vehículos
        console.log('Data', data);
        // Valida que los datos de los vehículos no sea undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = schemaClient.validate(data)

        if (error) {
            return res.status(401).json({ success: true, message: error.message })
        }

        req.body = value
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.CLIENTS, typeError.CLIENTS.POST);
        HandleError(code, error.message, 'middlewares/clients/validateDataInsert.middleware/MdlwareValidateDataInsertClient', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información. Intente más tarde' })
    }
}