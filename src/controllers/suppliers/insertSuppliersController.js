import { HandleError } from '../../utils/HandleError.js';
import { InsertSupplier } from '../../querys/suppliers/insertSuppliers.js';
import { GenerateCodeError } from '../../utils/getCodeError.js';
import { modules } from '../../dictionary/modules.js';
import { typeError } from '../../dictionary/typeError.js';

//controlador para insertar proveedor
export const CtrInsertSuppliers = async (req, res) => {
    try {
        //obtiene los datos del request body
        const supplier = req.body;

        //valida que los datos no sean nulos
        if (!supplier){
            return res.status(400).json({success: false, message: 'Por favor inserte los datos solicitados'});
        }

        const inserted = await InsertSupplier(supplier); //inserta los datos

        //valida que los datos se hayan insertados
        if (!inserted) {
            return res.status(400).json({success: false, message: 'No se pudo crear al proveedor.'});
        }

        return res.status(201).json({success: true, message: 'Proveedor creado satisfactoriamente!.'});
    } catch (error) {
        const code = GenerateCodeError(modules.SUPPLIERS, typeError.SUPPLIERS.POST)
        HandleError(code, error.message, 'controllers/suppliers/insertSuppliersController/CtrInsertSuppliers', error);
        return res.status(500).json({success: false, message: `${error.message}. Inténtelo más tarde` });
    }
}