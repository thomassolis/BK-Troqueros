import { v1 } from 'uuid';
import { HandleError } from '../../utils/HandleError.js';
import { InsertSupplier } from '../../querys/suppliers/insertSuppliers.js';

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
            return res.status(400).json({success: false, message: 'No se pudo agregar al proveedor.'});
        }

        return res.status(201).json({success: true, message: 'Proveedor agregado.'});
    } catch (error) {
        HandleError(v1(), error.message, 'controllers/suppliers/insertSuppliersController/CtrInsertSuppliers', error, 'user');
        return res.status(500).json({success: false, message: 'Error interno del servidor'});
    }
}