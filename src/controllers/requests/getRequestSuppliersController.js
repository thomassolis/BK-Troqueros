import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { GetRequestSuppliers } from '../../querys/requests/getRequestSuppliers.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { HandleError } from '../../utils/HandleError.js';


export const Ctr_GetRequestSuppliers = async (req, res) => {
    try {
        const supplier = await GetRequestSuppliers(); // Obtiene los proveedores

        // Valida que los proveedores no sean undefined
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Proveedores no encontrados. Inténtelo más tarde.' });
        }

        return res.status(200).json({ success: true, message: 'Data Enviada', data: supplier });
    } catch (error) {
        const code = GenerateCodeError(modules.REQUESTS, typeError.SERVICES.GET);
        HandleError(code, error.message, 'controllers/requests/getRequestSuppliersController/Ctr_GetRequestSuppliers', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}