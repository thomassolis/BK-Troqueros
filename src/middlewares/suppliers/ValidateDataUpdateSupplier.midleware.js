import { HandleError } from '../../utils/HandleError.js';
import Joi from 'joi';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';
import { schemaSuppliers } from './insertSuppliers.middleware.js';

const schemaSuppliersUpd = schemaSuppliers.keys({
    id_proveedor: Joi.string().trim().required().messages({
        'any.required': 'El identificador es requerido'
    })
})

export const Mdlware_ValidateDataUpdateSuppliers = (req, res, next) => {
    try {
        const data = req.body; // Obtiene la data del conductor
        
        // Valida que los datos del conductor no sean undefined
        if (!data || !Object.keys(data).length) {
            return res.status(400).json({ success: true, message: 'Favor de proporcionar la información solicitada.' })
        }

        const { error, value } = schemaSuppliersUpd.validate(data)
        
        if (error) {
            return res.status(403).json({ success: false, message: error.message });
        }

        req.body = value;
        next();
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.PUT)
        HandleError(code, error.message, 'middlewares/suppliers/ValidateDataUpdateSuppliers.middlewares/Mdlware_ValidateDataUpdateSuppliers', error)
        return res.status(500).json({success: false, message: 'Ha ocurrido un error al validar los datos del proveedor. Inténte más tarde'});
    }
}