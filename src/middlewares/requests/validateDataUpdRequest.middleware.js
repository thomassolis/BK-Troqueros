import { HandleError } from '../../utils/HandleError.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { 
    schemaRequest, 
    schemaEntregaProveedor, 
    schameRequestEntregaVacio, 
    schemaEntregaVacio_proveedor, 
    schemaRequestExtraCosts,
    schemaEntregaVacio_ExtraCosts
} from "../../schema/schemaRequests.js";

export const Mdlware_ValidateDataUpdRequest = (req, res, next) =>{
    try {
        const data = req.body; // Obtenemos los datos de la petición

        // Valida que los datos de la petición no sea undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        let error, value;

        // Valida el schema de la data
        if (data?.tipo_entregaVacio && data?.tipo_entregaProveedor) {
            ({ error, value } = schemaEntregaVacio_proveedor.validate(data));
        } else if (data?.tipo_costosExtras && data?.tipo_entregaVacio){
            ({ error, value } = schemaEntregaVacio_ExtraCosts.validate(data));
        } else if (data?.tipo_costosExtras){
            ({ error, value } = schemaRequestExtraCosts.validate(data));
        } else if (data?.tipo_entregaVacio) {
            ({ error, value } = schameRequestEntregaVacio.validate(data));
        } else if (data?.tipo_entregaProveedor) {
            ({ error, value } = schemaEntregaProveedor.validate(data));
        } else {
            ({ error, value } = schemaRequest.validate(data));
        }

        if (error) {
            return res.status(401).json({ success: true, message: error.message })
        }
        
        req.body = value
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.REQUESTS.POST);
        HandleError(code, error.message, 'middlewares/requests/validateDataUpdRequests.middleware/Mdlware_ValidateDataUpdRequest', error);
        return res.status(500).json({ success: true, message: 'Ha ocurrido un error con la validación de la información. Intente más tarde' })
    }
}