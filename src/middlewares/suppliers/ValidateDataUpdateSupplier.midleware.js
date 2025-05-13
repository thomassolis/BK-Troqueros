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
        const { error, value } = schemaSuppliersUpd.validate(req.body)
        
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