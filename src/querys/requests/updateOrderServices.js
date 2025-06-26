import sql from 'mssql';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { AddExtraCostsOrderServices } from './addExtraCost.js';

// Actualiza os datos de la petición
export const UpdOrderServiceRequest = async (transaction, services) => {
    try {
        const result = await transaction.request();
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.PUT);
        HandleError(code, error.message, 'querys/requests/updateOrderServices/UpdOrderServiceRequest', error);
        throw new Error(`Ha ocurrido un error al actualizar la información de la petición{idRequest}`);
    }
}